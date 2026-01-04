
class MqttLimitError extends Error{
    constructor(message){
        super(message);
        this.name = "MqttLimitError";
    }
}

async function sendMQTTMEssage(topic, message){
    try{
        const user = firebase.auth().currentUser;
        if(!user){
            showError("Utilisateur non connecté");
            return;
        }

        const token = await user.getIdToken();

        const res = await fetch(
            "https://mqtt-server-production-00a0.up.railway.app/heater",
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+ token
                },
                body: JSON.stringify({ state: message }) // true or false
            }
        );

        if(!res.ok){
            let errorMessage = "Erreur inconnue"

            try{
                const data = await res.json();
                errorMessage = data.error || errorMessage;
            }catch(err){
                throw new Error("Erreur inconnue limit MQTT");
            }
            throw new MqttLimitError(errorMessage);
        }

        const data = await res.json();
        console.log("MQTT OK:", data);
    } catch (err){
        console.log("Erreur MQTT:", err);
        if(err.name === "MqttLimitError"){
            showWarning(err.message);
            throw new MqttLimitError("Erreur sur les limit MQTT");
        }else{
            console.log("Erreur MQTT:", err);
            throw new Error("Erreur envoie mqtt");
        }
    }
}