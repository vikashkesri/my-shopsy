import React from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";

const HomePage = () => {
    const [auth, setAuth] = useAuth(); // Get auth state from context

    return (
        <Layout title={"Best Offers"}>
            <h1>Home Page</h1>
            <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                
                {auth ? (
                    <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                        {JSON.stringify(auth, null, 4)}
                    </pre>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </Layout>
    );
};

export default HomePage;
