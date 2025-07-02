import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.META_ACCESS_TOKEN;
  const appId = process.env.META_APP_ID;

  if (!accessToken || !appId) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: "Configuração da API Meta não encontrada",
        details: {
          hasAccessToken: !!accessToken,
          hasAppId: !!appId,
        },
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}`);

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "ERROR",
          message: "Token de acesso inválido",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "OK",
      message: "API Meta configurada corretamente",
      timestamp: new Date().toISOString(),
    });
  } catch (apiError) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: "Erro ao conectar com a API Meta",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
