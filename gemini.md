Using Gemini API keys



Note: This version of the page covers the Interactions API. You can use the toggle on this page to switch to the generateContent API version of this page.
To use the Gemini API, you must authenticate your requests. You can authenticate using a standard or authorization API key.

Create or view a Gemini API Key

API key types: Standard versus Authorization
API keys provide access to the Gemini API, but their security characteristics differ. The Gemini API is transitioning from standard API keys to authorization keys to improve security:

Standard API keys: Associate requests with a Google Cloud project for billing and quota purposes. Standard keys don't identify a caller, which limits the granularity of permissions and access control they can support.
Authorization (auth) keys: Bound directly to a Google Cloud service account. When you use an authorization key, your requests are processed under the identity of that bound service account, enabling granular access control. Authorization keys are restricted to the Generative Language API (Gemini API) by default and provide fast-acting leaked key enforcement that quickly stops the usage of leaked keys detected by our systems.
To ensure secure usage, Gemini API will move from Standard keys to Auth keys:

Auth keys default: All new API keys created in Google AI Studio are automatically created as auth keys.
Unrestricted keys rejected: The Gemini API rejects requests from unrestricted standard keys. Standard API keys that have explicit restrictions applied continue to work. This restriction prevents the unauthorized use of keys that might be shared publicly or linked to other services.
On September 2026: the Gemini API will reject requests from Standard keys. You must migrate to auth keys before this date to avoid service interruption. Make sure to migrate to auth keys before September 2026.
Note: Requests authenticated by authorization keys are not recorded in Google Cloud service account usage metrics.
Managing API keys in Google AI Studio
You can manage your projects and keys directly in Google AI Studio.

Google Cloud projects
Every Gemini API key is associated with a Google Cloud project. Google Cloud projects manage billing, collaborators, and permissions. Google AI Studio provides a lightweight interface to access these projects.

Default project: If you are a new user, Google AI Studio automatically creates a default Google Cloud project and API key after you accept the Terms of Service. You can rename this project by navigating to the Projects view in your dashboard.
Existing projects: If you already have a Google Cloud account, AI Studio does not create a default project. Instead, you must import your existing projects.
Importing projects
By default, Google AI Studio does not display all of your Google Cloud projects. You must import the projects you want to use:

Go to Google AI Studio.
Open the Dashboard from the left panel and select Projects.
Click the Import projects button.
Search for and select the Google Cloud project you want to import, then click Import.
Once imported, navigate to the API Keys page in the dashboard to create a key in that project.
Troubleshooting key creation permissions
If the Create API key button is unavailable and displays the message: "You do not have permission to create a key in this project", you lack the required IAM permissions.

Ask your Google Cloud project or organization administrator to grant you a role containing the following permissions (such as Project Editor):

resourcemanager.projects.get: Allows AI Studio to verify the project.
apikeys.keys.create: Allows key generation.
serviceusage.services.enable: Ensures the Generative Language API is enabled.
iam.serviceAccounts.create: Required to create the linked service account.
iam.serviceAccountApiKeyBindings.create: Binds the service account to the API key.
If you cannot get administrative access, you can create a new Google Cloud project that is not associated with an organization to generate your keys.

Setting up your environment
Once you have a key, configure your environment to use it securely in your applications.

Option 1: Use environment variables (Recommended)
Set the environment variable GEMINI_API_KEY or GOOGLE_API_KEY. The Gemini API client libraries automatically detect and use these variables. If both are set, GOOGLE_API_KEY takes precedence.

Select your operating system to set the variable:

Linux/macOS - Bash
macOS - Zsh
Windows
Search for "Environment Variables" in the Windows search bar.
Click Environment Variables in the System Properties dialog.
Under User variables or System variables, click New....
Set the variable name to GEMINI_API_KEY and the value to your API key.
Click OK to save. Open a new terminal session to load the variable.
Option 2: Provide the API key explicitly in code
You can pass the API key explicitly when initializing the client. Only do this if you cannot use environment variables.

Python
JavaScript
Go
Java
REST

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

async function main() {
  const interaction = await ai.interactions.create({
    model: "gemini-3.5-flash",
    input: "Explain how AI works in a few words",
  });
  console.log(interaction.output_text);
}

main();
Security and secret management
Treat your Gemini API key like a password. If compromised, others can consume your project's quota, incur unexpected billing charges, and access private resources.

Critical security rules
Keep keys confidential: Never check API keys into source control systems like Git.
Never expose keys client-side in production: Do not hardcode API keys directly in web or mobile apps. Keys compiled in client-side code can be extracted by users. To secure client-side apps, run a backend proxy server to make the actual API calls.
Secret management best practices
Environment variables: Read keys from environment variables rather than configuration files.
Secret Manager: For production, store your keys in a secure secret store such as Google Cloud Secret Manager.
Billing alerts: Set up billing alerts in the Google Cloud Console to notify you if usage or costs spike.
Leak response checklist
If you suspect your API key has been leaked:

Generate a new key: Create a replacement key in Google AI Studio or the Cloud Console.
Update your application: Deploy your code using the new key.
Disable or delete the compromised key: Disable the leaked key in the Cloud Console once the new key is verified. Do not delete the old key until the new key is fully active to avoid application downtime.
Audit usage: Check billing logs and API usage in the Google Cloud Console to identify unauthorized activity.
Restricting and securing your keys
Adding restrictions to your API keys minimizes the potential damage if a key is compromised.

Apply request origin restrictions
Origin restrictions limit which IP addresses, websites, or applications can use your key.

Go to the Google Cloud Console Credentials page.
Select your project, and click the name of the API key you want to restrict.
Under Application restrictions, select IP addresses (or the appropriate restriction type for your environment).
Specify the allowed IP addresses or ranges, then click Save.
Securing unrestricted standard API keys
To continue using the Gemini API, you must secure any unrestricted keys.

Method A: Restrict the key to the Gemini API only (AI Studio)
If you only use the key for the Gemini API, secure it directly in AI Studio:

On the API Keys page in Google AI Studio, locate keys marked with the Unrestricted label.
Hover over the label and click Add restrictions in the dialog.
Select Restrict to Gemini API only.
Click Restrict key to confirm.
Note: To restrict an API key, you must have the apikeys.keys.update permission on the associated Google Cloud project. This permission is included in roles like API Keys Admin or Editor.
Method B: Restrict the key for other services (Google Cloud Console)
If the key is shared with other Google APIs (not recommended), restrict it in the Cloud Console. Note: Gemini API requests using this key will fail after these restrictions are applied.

Visit the Google Cloud Console Credentials page.
Select the project and the API key.
Under API restrictions, use the Select API restrictions drop-down to select the APIs you want this key to access. Do not select the Generative Language API.
Click Save. Create a separate, restricted key in AI Studio to continue using the Gemini API.
Blocked dormant keys
Starting May 7, 2026, the Gemini API blocks unrestricted API keys that have been dormant for an extended period. These keys show a Blocked tag in AI Studio. You must generate a new key or use an existing restricted key to continue.

Migrate to an auth key
Follow these steps to create a new auth API key and update your applications:

Go to the AI Studio API Keys page.
Check the Key Type column to identify any keys listed as Standard.
Click Create API key to generate a new key. All new keys created in AI Studio are automatically created as auth keys.
Copy the new auth API key.
Update your application code, environment variables, and any deployment configurations to use the new auth API key.
Test your application to confirm it works correctly with the new key.
Once verified, delete or revoke your old traffic key to prevent misuse.
Note: If you don't see your keys, you may need to import your Cloud projects into AI Studio. Refer to the import projects section for instructions.
Limitations
Google AI Studio imposes the following project and key management limitations:

You can create a maximum of 10 projects at a time from the Google AI Studio Projects page.
The API keys and Projects pages display a maximum of 100 keys and 50 projects.
Only API keys that are unrestricted or restricted specifically to the Generative Language API (Gemini API) are displayed.
For advanced project management or to modify keys with other restrictions, use the Google Cloud Console credentials page.