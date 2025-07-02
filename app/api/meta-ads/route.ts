import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerms = searchParams.get("search_terms")?.trim() || "";
    const adReachedCountries = searchParams.get("ad_reached_countries") || "BR";
    const adActiveStatus = searchParams.get("ad_active_status") || "ALL";
    const mediaType = searchParams.get("media_type") || "ALL";
    const limit = searchParams.get("limit") || "20";

    const accessToken = process.env.META_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Token de acesso do Meta não encontrado. Configure META_ACCESS_TOKEN no .env.local",
          success: false,
        },
        { status: 500 }
      );
    }

    if (!searchTerms) {
      return NextResponse.json(
        {
          error: "Termo de busca é obrigatório",
          success: false,
        },
        { status: 400 }
      );
    }

    const fields = [
      "id",
      "ad_creation_time",
      "ad_creative_bodies",
      "ad_creative_link_captions",
      "ad_creative_link_descriptions",
      "ad_creative_link_titles",
      "ad_delivery_start_time",
      "ad_delivery_stop_time",
      "ad_snapshot_url",
      "bylines",
      "currency",
      "delivery_by_region",
      "demographic_distribution",
      "impressions",
      "languages",
      "page_id",
      "page_name",
      "publisher_platforms",
      "spend",
      "ad_creative_link_urls",
    ].join(",");

    const baseUrl = "https://graph.facebook.com/v18.0/ads_archive";
    const params = new URLSearchParams({
      access_token: accessToken,
      search_terms: searchTerms,
      ad_reached_countries: adReachedCountries,
      ad_active_status: adActiveStatus,
      fields,
      limit,
    });

    if (mediaType !== "ALL") {
      params.append("media_type", mediaType);
    }

    console.log("Buscando anúncios na Meta Ad Library:", {
      searchTerms,
      adReachedCountries,
      adActiveStatus,
      mediaType,
      limit,
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API Meta:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Erro na API do Meta",
          success: false,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || [],
      total: (data.data || []).length,
      paging: data.paging,
    });
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN || process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Token do Meta não configurado" },
        { status: 500 }
      );
    }

    const testUrl = "https://graph.facebook.com/v18.0/ads_archive";
    const params = new URLSearchParams({
      access_token: accessToken,
      search_terms: "test",
      ad_reached_countries: "BR",
      limit: "1",
      fields: "id,page_name",
    });

    const response = await fetch(`${testUrl}?${params}`);
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Conexão com Meta Ad Library OK",
        test_result: data,
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.error?.message || "Erro na conexão" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao testar conexão" },
      { status: 500 }
    );
  }
}
