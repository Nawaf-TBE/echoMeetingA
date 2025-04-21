
/**
 * Google Calendar OAuth handler edge function.
 * Exchanges the provided code for tokens and stores them in the calendar_connections table.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check authorization header
  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    console.error("Missing authorization header");
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { code, redirect_uri, user_id } = await req.json();

    if (!code || !redirect_uri || !user_id) {
      console.error("Invalid request: Missing required parameters");
      return new Response(JSON.stringify({ error: "Invalid request: Missing required parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load secrets from environment
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !SUPABASE_SERVICE_ROLE_KEY || !SUPABASE_URL) {
      console.error("Missing environment configuration");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("Exchanging authorization code for tokens...");
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: "authorization_code",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("Token exchange failed:", errorText);
      return new Response(JSON.stringify({ error: "Failed to exchange code for tokens", detail: errorText }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const tokenData = await tokenRes.json();
    console.log("Token exchange successful");

    // Store tokens in database
    console.log("Storing tokens in database...");
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/calendar_connections`, {
      method: "POST",
      headers: {
        apiKey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([{
        user_id: user_id,
        provider: "google",
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token ?? null,
        expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      }])
    });

    if (!dbRes.ok) {
      const errorText = await dbRes.text();
      console.error("Database storage failed:", errorText);
      return new Response(JSON.stringify({ error: "Error storing tokens in database", detail: errorText }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("Google Calendar connection successful");
    return new Response(JSON.stringify({ success: true }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Unexpected error occurred", message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
