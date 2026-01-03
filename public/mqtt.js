
class MqttLimitError extends Error{
    constructor(message){
        super(message);
        this.name = "MqttLimitError";
    }
}

async function  getMQTTCreadentials(){
    const docRef = db.collection('MQTT').doc('credentials');
    const docSnap = await docRef.get();

    if(!docSnap.exists) throw new Error("MQTT credentials not found");

    return docSnap.data();
}

async function sendMQTTMEssage(topic, message){
    try{
        const creds = await getMQTTCreadentials();

        await CanSendMQTT();

        const client = mqtt.connect('wss://io.adafruit.com:443',{
            username: creds.username,
            password: creds.key
        });

        client.on('connect', ()=> {
            console.log('MQTT connecté');
            client.publish(`${creds.username}/feeds/${topic}`, message, {}, () => {
                console.log('Message envoyé:', message);
                setTimeout(()=>{
                    client.end();
                },100);
            });
        });

        client.on('error', (err) => {
            console.log('Erreur MQTT', err);
            client.end();
        });
    } catch (err){
        console.log(err.message);
        if(err.name === "MqttLimitError"){
            showWarning(err.message);
            throw new MqttLimitError("Erreur sur les limit MQTT");
        }else{
            throw new Error("Erreur envoie mqtt");
        }
    }
}

async function CanSendMQTT(){
    const user = auth.currentUser;
    if(!user){
        throw new MqttLimitError("Utilisateur non connecté");
    }

    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);

    const limitsSnap = await db.doc("config/mqtt_limits").get();
    if(!limitsSnap.exists){
        throw new MqttLimitError("Limites MQTT absentes");
    }

    const limits = limitsSnap.data();

    const usageRef = db.doc("system/mqtt_usage");
    const usageSnap = await usageRef.get();

    let usage = usageSnap.exists ? usageSnap.data() : {
        minuteCount: 0,
        minuteWindow: now,
        dayCount: 0,
        dayWindow:today
    };

    if( now - usage.minuteWindow > 60000){
        usage.minuteWindow = now;
        usage.minuteCount = 0;
    }

    if(usage.dayWindow !== today){
        usage.dayWindow = today;
        usage.dayCount = 0;
    }

    if(usage.minuteCount >= limits.maxPerMinute){
        throw new MqttLimitError("Limite minute atteinte");
    }

    if(usage.dayCount >= limits.maxPerDay){
        throw new MqttLimitError("Quota journalier atteint");
    }

    usage.minuteCount++;
    usage.dayCount++;

    await usageRef.set(usage, { merge: true });

    return true;
}