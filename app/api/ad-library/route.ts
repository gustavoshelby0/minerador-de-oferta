import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q");
    const country = searchParams.get("country") || "BR";
    const adType = searchParams.get("ad_type") || "ALL";
    const limit = searchParams.get("limit") || "25";

    if (!query || query.trim() === "") {
      return NextResponse.json(
        { error: "Parâmetro 'q' (query) é obrigatório", success: false },
        { status: 400 }
      );
    }

    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Token de acesso do Meta não configurado", success: false },
        { status: 500 }
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

    const params = new URLSearchParams({
      access_token: accessToken,
      search_terms: query,
      ad_reached_countries: country,
      ad_active_status: adType,
      fields,
      limit,
    });

    const url = `https://graph.facebook.com/v18.0/ads_archive?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: errorData.error?.message || "Erro desconhecido da API Meta",
          success: false,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor", success: false },
      { status: 500 }
    );
  }
}
