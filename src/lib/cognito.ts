// src/lib/cognito.ts
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider"

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || "us-east-2",
})

export async function signUpUser(email: string, password: string) {
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  })

  try {
    const response = await cognitoClient.send(command)
    return response
  } catch (error) {
    console.error("Error en el registro:", error)
    throw error
  }
}

export async function signInUser(email: string, password: string) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  })

  try {
    const response = await cognitoClient.send(command)
    return response
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    throw error
  }
}