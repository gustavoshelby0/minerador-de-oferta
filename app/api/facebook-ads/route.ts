import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const advertiser = searchParams.get("advertiser") || "";
    const country = searchParams.get("country") || "BR";
    const limit = searchParams.get("limit") || "50";

    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "FACEBOOK_ACCESS_TOKEN não configurado nas variáveis de ambiente da Vercel." },
        { status: 500 }
      );
    }

    const apiUrl = `https://graph.facebook.com/v19.0/ads_archive?` +
      `access_token=${accessToken}` +
      `&search_terms=${encodeURIComponent(advertiser)}` +
      `&ad_reached_countries=${encodeURIComponent(country)}` +
      `&ad_active_status=ALL` +
      `&fields=ad_creative_body,ad_creation_time,ad_delivery_start_time,page_name,impressions,spend,demographic_distribution` +
      `&limit=${encodeURIComponent(limit)}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API Meta:", data);
      return NextResponse.json(
        { error: data.error?.message || "Erro ao consultar a API da Meta." },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor ao buscar campanhas." },
      { status: 500 }
    );
  }
}
