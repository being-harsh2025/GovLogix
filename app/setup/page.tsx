export default function SetupPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🔧 GovLogix Setup Verification</h1>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#f0f0f0",
          borderRadius: "8px",
        }}
      >
        <h2>Environment Variables Check</h2>
        <p>
          <strong>Status:</strong> Please check your Vercel project settings
        </p>

        <h3>Required Variables:</h3>
        <ul>
          <li>
            <code>TURSO_DATABASE_URL</code>
            <br />
            <small>
              Value: libsql://govlogix-harshxrtx.aws-ap-south-1.turso.io
            </small>
          </li>
          <li>
            <code>TURSO_AUTH_TOKEN</code>
            <br />
            <small>Value: (your auth token - check your local .env file)</small>
          </li>
        </ul>

        <h3>Steps to Set Variables in Vercel:</h3>
        <ol>
          <li>
            Go to <strong>Vercel Dashboard</strong>
          </li>
          <li>
            Select your <strong>gov-logix</strong> project
          </li>
          <li>
            Click <strong>Settings</strong>
          </li>
          <li>
            Go to <strong>Environment Variables</strong>
          </li>
          <li>Add both variables with Production scope</li>
          <li>
            Go to <strong>Deployments</strong> tab
          </li>
          <li>
            Click <strong>Redeploy</strong> on the latest deployment
          </li>
          <li>Wait for build to complete ✅</li>
        </ol>

        <h3>Verify Setup:</h3>
        <p>After redeploying, visit this API endpoint:</p>
        <code
          style={{
            background: "#fff",
            padding: "10px",
            display: "block",
            marginTop: "10px",
          }}
        >
          https://gov-logix.vercel.app/api/health
        </code>
        <p>
          Should return: <code>{"{status: 'ok', database: 'connected'}"}</code>
        </p>
      </section>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#fff3cd",
          borderRadius: "8px",
          borderLeft: "4px solid #ffc107",
        }}
      >
        <h3>⚠️ Common Issues:</h3>
        <ul>
          <li>
            ❌ Variables not added → Go to Vercel Settings → Environment
            Variables
          </li>
          <li>
            ❌ Added but not redeployed → Click Redeploy after adding variables
          </li>
          <li>❌ Wrong scope → Make sure "Production" scope is selected</li>
          <li>
            ❌ Typo in variable names → Must be exactly: TURSO_DATABASE_URL and
            TURSO_AUTH_TOKEN
          </li>
        </ul>
      </section>

      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#d4edda",
          borderRadius: "8px",
          borderLeft: "4px solid #28a745",
        }}
      >
        <h3>✅ Next Steps Once Variables Are Set:</h3>
        <ol>
          <li>Redeploy in Vercel</li>
          <li>Wait for deployment to complete (green checkmark)</li>
          <li>Visit /lsp/register again</li>
          <li>Fill in the form and submit</li>
        </ol>
      </section>
    </div>
  );
}
