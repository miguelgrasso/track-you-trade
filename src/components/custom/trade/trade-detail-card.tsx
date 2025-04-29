import { useState, useEffect } from "react";
import { Trade } from "@/app/interface/trade.interface";
import { NewTradeDetail } from "@/app/interface/newtradedetail.interface";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, ChevronLeft, ChevronRight, FileText, ChevronUp, ChevronDown, Edit, Eye } from "lucide-react";
import { getTradeDetailsbyTradeId, createTradeDetail, updateTradeDetail } from "@/app/api/tradedetail.api";
import { useToast } from "@/components/ui/use-toast";

interface TradeDetailCardProps {
  trade: Trade;
}

export function TradeDetailCard({ trade }: TradeDetailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [observations, setObservations] = useState<string>("");
  const [currentTradeDetailTab, setCurrentTradeDetailTab] = useState(0);
  const [beforeImageUrl, setBeforeImageUrl] = useState("");
  const [afterImageUrl, setAfterImageUrl] = useState("");
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState<string | null>(null);
  const [afterImagePreview, setAfterImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [tradeDetailId, setTradeDetailId] = useState<number | null>(null);
  const [isLoadingTradeDetail, setIsLoadingTradeDetail] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasDetails, setHasDetails] = useState(false);
  const { toast } = useToast();

  // Cargar los detalles del trade cuando se abre el drawer
  useEffect(() => {
    const loadTradeDetails = async () => {
      if (!trade?.id) return;
      
      setIsLoadingTradeDetail(true);
      setLoadError(null);
      
      try {
        const tradeDetails = await getTradeDetailsbyTradeId(trade.id);
        
        console.log("tradeDetails",tradeDetails);
        // Validar que la respuesta sea válida
        if (!tradeDetails) {
          // Si no hay detalles, inicializar con valores vacíos
          setTradeDetailId(null);
          setObservations("");
          setBeforeImageUrl("");
          setAfterImageUrl("");
          setBeforeImagePreview(null);
          setAfterImagePreview(null);
          setHasDetails(false);
          return;
        }
        
        // Si hay detalles, actualizar los estados
        setTradeDetailId(tradeDetails.id);
        setObservations(tradeDetails.observaciones || "");
        setBeforeImageUrl(tradeDetails.imageUrlpre || "");
        setAfterImageUrl(tradeDetails.imageUrlpost || "");
        setHasDetails(true);
        
        // Si hay imágenes, mostrar previsualizaciones
        if (tradeDetails.imagepreview) {
          setBeforeImagePreview(tradeDetails.imagepreview);
        }
        if (tradeDetails.imagepost) {
          setAfterImagePreview(tradeDetails.imagepost);
        }
      } catch (error) {
        console.error("Error loading trade details:", error);
        
        // Manejar específicamente el error de JSON inválido
        if (error instanceof SyntaxError && error.message.includes("JSON")) {
          setLoadError("Error al procesar la respuesta del servidor. Por favor, inténtalo de nuevo más tarde.");
        } else {
          setLoadError("No se pudieron cargar los detalles del trade. Por favor, inténtalo de nuevo.");
        }
        
        // En caso de error, inicializar con valores vacíos
        setTradeDetailId(null);
        setObservations("");
        setBeforeImageUrl("");
        setAfterImageUrl("");
        setBeforeImagePreview(null);
        setAfterImagePreview(null);
        setHasDetails(false);
      } finally {
        setIsLoadingTradeDetail(false);
      }
    };
    
    // Solo cargar los detalles cuando se expande el componente
    if (isExpanded) {
      loadTradeDetails();
    }
  }, [trade?.id, isExpanded]);

  const handleNextTradeDetailTab = () => {
    setCurrentTradeDetailTab((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handlePrevTradeDetailTab = () => {
    setCurrentTradeDetailTab((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleBeforeImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBeforeImageUrl(e.target.value);
    setHasChanges(true);
  };

  const handleAfterImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAfterImageUrl(e.target.value);
    setHasChanges(true);
  };

  const handleBeforeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBeforeImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setBeforeImagePreview(e.target.result as string);
          setHasChanges(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAfterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAfterImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAfterImagePreview(e.target.result as string);
          setHasChanges(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservations(e.target.value);
    setHasChanges(true);
  };

  const handleSaveObservations = async () => {
    if (!trade) return;
    
    setIsSaving(true);
    
    try {
      const tradeDetailData: NewTradeDetail = {
        tradeId: trade.id,
        observaciones: observations,
        //imagepreview: beforeImageUrl,
        //imagepost: afterImageUrl
      };
      
      let response;
      if (tradeDetailId) {
        // Actualizar detalles existentes
        response = await updateTradeDetail(tradeDetailId, tradeDetailData);
      } else {
        // Crear nuevos detalles
        response = await createTradeDetail(tradeDetailData);
        if (response && response.id) {
          setTradeDetailId(response.id);
        }
      }
      
      setHasChanges(false);
      toast({
        title: "Observaciones guardadas",
        description: "Las observaciones del trade han sido guardadas correctamente.",
      });
    } catch (error) {
      console.error("Error saving trade details:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las observaciones. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBeforeImage = async () => {
    if (!trade) return;
    
    setIsSaving(true);
    
    try {
      const tradeDetailData: NewTradeDetail = {
        tradeId: trade.id,
        observaciones: observations,
        //imagepreview: beforeImageUrl,
        //imagepost: afterImageUrl
      };
      
      let response;
      if (tradeDetailId) {
        // Actualizar detalles existentes
        response = await updateTradeDetail(tradeDetailId, tradeDetailData);
      } else {
        // Crear nuevos detalles
        response = await createTradeDetail(tradeDetailData);
        if (response && response.id) {
          setTradeDetailId(response.id);
        }
      }
      
      setHasChanges(false);
      toast({
        title: "Imagen guardada",
        description: "La imagen de antes ha sido guardada correctamente.",
      });
    } catch (error) {
      console.error("Error saving before image:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la imagen. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAfterImage = async () => {
    if (!trade) return;
    
    setIsSaving(true);
    
    try {
      const tradeDetailData: NewTradeDetail = {
        tradeId: trade.id,
        observaciones: observations,
        //imagepreview: beforeImageUrl,
        //imagepost: afterImageUrl
      };
      
      let response;
      if (tradeDetailId) {
        // Actualizar detalles existentes
        response = await updateTradeDetail(tradeDetailId, tradeDetailData);
      } else {
        // Crear nuevos detalles
        response = await createTradeDetail(tradeDetailData);
        if (response && response.id) {
          setTradeDetailId(response.id);
        }
      }
      
      setHasChanges(false);
      toast({
        title: "Imagen guardada",
        description: "La imagen de después ha sido guardada correctamente.",
      });
    } catch (error) {
      console.error("Error saving after image:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la imagen. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <Button 
          variant="ghost" 
          className="w-full flex justify-between items-center p-0 h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Detalle del Trade
            {!isExpanded && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {hasDetails ? "Modo edición" : "Disponible para editar"}
              </span>
            )}
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="text-sm space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-muted-foreground">
              Documenta tu análisis con imágenes y observaciones
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Edit className="h-3 w-3" />
                <span>Modo edición</span>
              </div>
            </div>
          </div>
          
          {isLoadingTradeDetail ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-muted-foreground">Cargando detalles...</p>
            </div>
          ) : loadError ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-red-500">{loadError}</p>
            </div>
          ) : (
            <div className="relative">
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8"
                onClick={handlePrevTradeDetailTab}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8"
                onClick={handleNextTradeDetailTab}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="bg-card rounded-md p-0.5 border border-muted/20">
                {/* Card 1: Imagen Antes */}
                {currentTradeDetailTab === 0 && (
                  <Card className="rounded-md p-3 border-none shadow-none">
                    <CardHeader className="pb-2 px-1">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Imagen Antes
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-1 space-y-3">
                      <Tabs defaultValue="url" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-2">
                          <TabsTrigger value="url">URL</TabsTrigger>
                          <TabsTrigger value="upload">Archivo</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="url">
                          <div className="space-y-2">
                            <Input 
                              type="text" 
                              placeholder="https://ejemplo.com/imagen-antes.jpg" 
                              value={beforeImageUrl}
                              onChange={handleBeforeImageUrlChange}
                            />
                            {beforeImageUrl && (
                              <div className="aspect-video relative overflow-hidden rounded-md border">
                                <img 
                                  src={beforeImageUrl} 
                                  alt="Imagen Antes" 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    setBeforeImageUrl("");
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="upload">
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleBeforeFileChange}
                              className="cursor-pointer"
                            />
                            {beforeImagePreview && (
                              <div className="aspect-video relative overflow-hidden rounded-md border">
                                <img 
                                  src={beforeImagePreview} 
                                  alt="Vista previa" 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2 px-1">
                      <div className="text-xs text-muted-foreground">1 de 3</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isSaving}
                        onClick={handleSaveBeforeImage}
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {/* Card 2: Imagen Después */}
                {currentTradeDetailTab === 1 && (
                  <Card className="rounded-md p-3 border-none shadow-none">
                    <CardHeader className="pb-2 px-1">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Imagen Después
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-1 space-y-3">
                      <Tabs defaultValue="url" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-2">
                          <TabsTrigger value="url">URL</TabsTrigger>
                          <TabsTrigger value="upload">Archivo</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="url">
                          <div className="space-y-2">
                            <Input 
                              type="text" 
                              placeholder="https://ejemplo.com/imagen-despues.jpg" 
                              value={afterImageUrl}
                              onChange={handleAfterImageUrlChange}
                            />
                            {afterImageUrl && (
                              <div className="aspect-video relative overflow-hidden rounded-md border">
                                <img 
                                  src={afterImageUrl} 
                                  alt="Imagen Después" 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    setAfterImageUrl("");
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="upload">
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleAfterFileChange}
                              className="cursor-pointer"
                            />
                            {afterImagePreview && (
                              <div className="aspect-video relative overflow-hidden rounded-md border">
                                <img 
                                  src={afterImagePreview} 
                                  alt="Vista previa" 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2 px-1">
                      <div className="text-xs text-muted-foreground">2 de 3</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isSaving}
                        onClick={handleSaveAfterImage}
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {/* Card 3: Observaciones */}
                {currentTradeDetailTab === 2 && (
                  <Card className="rounded-md p-3 border-none shadow-none">
                    <CardHeader className="pb-2 px-1">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Observaciones
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-1 space-y-3">
                      <Textarea 
                        placeholder="Escribe tus observaciones, análisis o reflexiones sobre este trade..."
                        className="min-h-[150px] resize-y"
                        value={observations}
                        onChange={handleObservationsChange}
                      />
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2 px-1">
                      <div className="text-xs text-muted-foreground">3 de 3</div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleSaveObservations}
                        disabled={isSaving}
                      >
                        {isSaving ? "Guardando..." : "Guardar"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
} 