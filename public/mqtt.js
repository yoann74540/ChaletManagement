async function  getMQTTCreadentials(){
    const docRef = db.collection('MQTT').doc('credentials');
    const docSnap = await docRef.get();

    if(!docSnap.exists) throw new Error("MQTT credentials not found");

    return docSnap.data();
}

async function sendMQTTMEssage(topic, message){
    const creds = await getMQTTCreadentials();

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
}