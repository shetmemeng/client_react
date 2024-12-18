import React, { useState } from "react";
import axios, { AxiosError } from "axios";

const SendSmsComponent: React.FC = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        const myHeaders = {
            Authorization: "App 358cf404ea5306cc2c145b7653432261-ec9e10c2-afdf-434c-842f-806eae00babd",
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        const raw = {
            messages: [
                {
                    destinations: [{ to: "639635680058" }],
                    from: "447491163443",
                    text: "Hello, from alumni president please join. ",
                },
            ],
        };

        try {
            const result = await axios.post(
                "https://pe2n68.api.infobip.com/sms/2/text/advanced",
                raw,
                { headers: myHeaders }
            );
            setResponse(JSON.stringify(result.data));
            setError(null); // Reset error if request is successful
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
            setResponse(null); // Reset response if error occurs
        }
    };

    return (
        <div>
            <button onClick={sendMessage}>Send Message</button>
            {response && <div>Response: {response}</div>}
            {error && <div style={{ color: "red" }}>Error: {error}</div>}
        </div>
    );
};

export default SendSmsComponent;