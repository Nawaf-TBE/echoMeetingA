
/**
 * Edge function to securely provide the Google Client ID to the frontend
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if request is authenticated
  const authorization = req.headers.get('Authorization');
  if (!authorization) {
    console.error("Missing authorization header");
    return new Response(
      JSON.stringify({ error: 'Missing authorization header' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Return the Google Client ID from environment variable
    const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
    
    if (!GOOGLE_CLIENT_ID) {
      console.error("Google Client ID environment variable is not set");
      return new Response(
        JSON.stringify({ error: 'Google Client ID not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Successfully retrieved Google Client ID");
    return new Response(
      JSON.stringify({ client_id: GOOGLE_CLIENT_ID }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error retrieving Google Client ID:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
