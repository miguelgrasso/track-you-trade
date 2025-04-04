import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AdminCreateUserCommand, AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function signUpWithCognito(email: string, password: string) {
  try {
    // Registrar usuario en Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID!,
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    });

    const signUpResponse = await cognitoClient.send(signUpCommand);

    return {
      success: true,
      userSub: signUpResponse.UserSub,
    };
  } catch (error: any) {
    console.error("Error en el registro con Cognito:", error);
    throw error;
  }
}

export async function signInWithCognito(email: string, password: string) {
  try {
    // Iniciar sesión en Cognito
    const signInCommand = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID!,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const signInResponse = await cognitoClient.send(signInCommand);

    return {
      success: true,
      accessToken: signInResponse.AuthenticationResult?.AccessToken,
      idToken: signInResponse.AuthenticationResult?.IdToken,
    };
  } catch (error: any) {
    console.error("Error en el inicio de sesión con Cognito:", error);
    throw error;
  }
}

function generateStrongPassword() {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Asegurar al menos uno de cada tipo
  let password = 
    uppercase[Math.floor(Math.random() * uppercase.length)] +
    lowercase[Math.floor(Math.random() * lowercase.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    symbols[Math.floor(Math.random() * symbols.length)];
  
  // Llenar el resto con caracteres aleatorios
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mezclar la contraseña
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function generatePasswordByMethod(method: 'strong' | 'uuid' | 'hash' = 'uuid') {
  switch (method) {
    case 'strong':
      return generateStrongPassword();
    case 'uuid':
      // Usar UUID v4 con algunos caracteres especiales para cumplir requisitos
      return `${uuidv4()}!Aa1`;
    case 'hash':
      // Crear un hash basado en timestamp y convertirlo a una contraseña válida
      const timestamp = Date.now().toString();
      const hash = createHash('sha256').update(timestamp).digest('hex');
      // Asegurar que cumple con los requisitos añadiendo caracteres necesarios
      return `${hash.substring(0, 20)}!Aa1`;
    default:
      return generateStrongPassword();
  }
}

export async function createGoogleUserInCognito(email: string, sub: string) {
  try {
    // Verificar si los parámetros son válidos
    if (!email || !sub) {
      throw new Error("Email y sub son requeridos para crear usuario de Google")
    }

    // Crear usuario en Cognito para Google Sign In
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
        // Marcar que este usuario usa autenticación externa
        {
          Name: "custom:auth_provider",
          Value: "google",
        },
        // Solo agregamos el sub de Google si está configurado el atributo personalizado
        ...(process.env.ENABLE_GOOGLE_SUB === "true" ? [{
          Name: "custom:google_sub",
          Value: sub,
        }] : []),
      ],
      MessageAction: "SUPPRESS", // No enviar email
    });

    try {
      await cognitoClient.send(createUserCommand);
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        // Si el usuario ya existe, actualizamos sus atributos para asegurar que está marcado como usuario de Google
        console.log("Usuario ya existe en Cognito, actualizando atributos:", email);
        // Aquí podrías agregar lógica para actualizar los atributos del usuario si es necesario
        return { success: true };
      }
      // Si el error es por el atributo personalizado, continuamos sin él
      if (error.message?.includes("custom:google_sub")) {
        console.warn("No se pudo guardar el sub de Google, continuando sin él");
        // Intentar crear el usuario sin el atributo personalizado pero manteniendo el provider
        const retryCommand = new AdminCreateUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: email,
          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
            {
              Name: "email_verified",
              Value: "true",
            },
            {
              Name: "custom:auth_provider",
              Value: "google",
            },
          ],
          MessageAction: "SUPPRESS",
        });
        await cognitoClient.send(retryCommand);
        return { success: true };
      }
      throw error;
    }

    // No necesitamos establecer una contraseña para usuarios de Google
    // ya que solo se autenticarán a través de Google

    return { success: true };
  } catch (error: any) {
    console.error("Error al crear usuario de Google en Cognito:", error);
    throw new Error(`Error al crear usuario en Cognito: ${error.message || 'Error desconocido'}`);
  }
} 