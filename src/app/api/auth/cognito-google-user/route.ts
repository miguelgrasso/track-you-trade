import { NextRequest, NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { z } from 'zod';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const googleUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  sub: z.string().min(1, 'Google sub is required')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, sub } = googleUserSchema.parse(body);

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
        {
          Name: "custom:auth_provider",
          Value: "google",
        },
        ...(process.env.ENABLE_GOOGLE_SUB === "true" ? [{
          Name: "custom:google_sub",
          Value: sub,
        }] : []),
      ],
      MessageAction: "SUPPRESS",
    });

    try {
      await cognitoClient.send(createUserCommand);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        return NextResponse.json({ success: true });
      }
      
      if (error.message?.includes("custom:google_sub")) {
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
        return NextResponse.json({ success: true });
      }
      throw error;
    }
  } catch (error) {
    console.error("Google user creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'User creation failed' },
      { status: 500 }
    );
  }
}