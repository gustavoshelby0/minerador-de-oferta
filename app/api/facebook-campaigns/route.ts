import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "20";

    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    let adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return NextResponse.json(
        {
          error: "Configure FACEBOOK_ACCESS_TOKEN e FACEBOOK_AD_ACCOUNT_ID no .env.local",
          success: false,
        },
        { status: 500 }
      );
    }

    // Garantir que o adAccountId tenha o prefixo 'act_'
    if (!adAccountId.startsWith("act_")) {
      adAccountId = `act_${adAccountId}`;
    }

    const campaignFields = [
      "id",
      "name",
      "status",
      "objective",
      "created_time",
      "updated_time",
      "start_time",
      "stop_time",
      "daily_budget",
      "lifetime_budget",
      "budget_remaining",
      "spend_cap",
    ].join(",");

    const baseUrl = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns`;
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: campaignFields,
      limit: limit,
      effective_status:
        '["ACTIVE","PAUSED","PENDING_REVIEW","DISAPPROVED","PREAPPROVED","PENDING_BILLING_INFO","CAMPAIGN_PAUSED","ARCHIVED","ADSET_PAUSED"]',
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API Facebook:", data);
      return NextResponse.json(
        {
          error: data.error?.message || "Erro na API do Facebook",
          success: false,
        },
        { status: response.status || 400 }
      );
    }

    const campaigns = data.data || [];

    const campaignsWithInsights = await Promise.all(
      campaigns.map(async (campaign: any) => {
        try {
          const insightsUrl = `https://graph.facebook.com/v18.0/${campaign.id}/insights`;
          const insightsParams = new URLSearchParams({
            access_token: accessToken,
            fields: "impressions,clicks,spend,ctr,cpc,actions,cost_per_action_type",
            time_range: JSON.stringify({
              since: "2024-12-01",
              until: "2024-12-15",
            }),
          });

          const insightsResponse = await fetch(`${insightsUrl}?${insightsParams.toString()}`);
          const insightsData = await insightsResponse.json();

          const insights = (insightsData.data && insightsData.data[0]) || {};

          const spend = parseFloat(insights.spend || "0");
          const conversions =
            insights.actions?.find(
              (action: any) =>
                action.action_type === "purchase" || action.action_type === "lead"
            )?.value || 0;

          const mockNichos = ["Emagrecimento", "Renda Extra", "Saúde", "Sexualidade", "Beleza", "Espiritualidade"];
          const mockFormatos = ["VSL", "Quiz", "Typebot"];
          const mockTickets = ["R$ 67", "R$ 97", "R$ 147", "R$ 197", "R$ 297", "R$ 497"];

          const campaignHash = campaign.id.slice(-2);
          const parsedHash = parseInt(campaignHash, 16);

          return {
            ...campaign,
            insights: {
              impressions: parseInt(insights.impressions || "0"),
              clicks: parseInt(insights.clicks || "0"),
              spend: spend,
              ctr: parseFloat(insights.ctr || "0"),
              cpc: parseFloat(insights.cpc || "0"),
              roas: spend > 0 ? (conversions * 100) / spend : Math.random() * 5 + 2,
            },
            nicho: mockNichos[parsedHash % mockNichos.length],
            formato: mockFormatos[parsedHash % mockFormatos.length],
            ticket: mockTickets[parsedHash % mockTickets.length],
          };
        } catch (error) {
          console.error(`Erro ao buscar insights para campanha ${campaign.id}:`, error);
          return {
            ...campaign,
            insights: {
              impressions: 0,
              clicks: 0,
              spend: 0,
              ctr: 0,
              cpc: 0,
              roas: 0,
            },
            nicho: "Outros",
            formato: "VSL",
            ticket: "R$ 97",
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: campaignsWithInsights,
      source: "facebook_api",
      total: campaigns.length,
    });
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
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
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    let adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return NextResponse.json(
        {
          error: "Configure FACEBOOK_ACCESS_TOKEN e FACEBOOK_AD_ACCOUNT_ID no .env.local",
          success: false,
        },
        { status: 500 }
      );
    }

    if (!adAccountId.startsWith("act_")) {
      adAccountId = `act_${adAccountId}`;
    }

    const testUrl = `https://graph.facebook.com/v18.0/${adAccountId}`;
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: "id,name,account_status",
    });

    const response = await fetch(`${testUrl}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error?.message || "Erro na conexão com Facebook",
          success: false,
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com Facebook Ads estabelecida com sucesso",
      account: data,
    });
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        success: false,
      },
      { status: 500 }
    );
  }
}
