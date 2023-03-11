import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  var [origin, setOrigin] = useState<string>();

  useEffect(() => {
    if (typeof window !== undefined) {
      setOrigin(window.location.origin);
    }
  }, [origin]);

  console.log(origin);

  return (
    <Auth0Provider
      clientId={process.env.NEXT_PUBLIC_AUTH0_CID ?? ""}
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? ""}
      authorizationParams={{
        redirect_uri: origin,
      }}
    >
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        async
      />
      <Component {...pageProps} />
    </Auth0Provider>
  );
}
