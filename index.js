const express = require('express');
const shell = require('shelljs')

const app = express();

const port = 3500;

app.get('/', (req, res) => {
    res.send('Reply from nodeJS + express');
});

app.get('/update', (req, res) => {
    shell.exec('../ShellScript/updateKubePod.sh')
    res.json({kubeUpdate:"success"});
    
    // Restart one more time with delay of 10 seconds.
    setTimeout(function(){
        shell.exec('../ShellScript/updateKubePod.sh')
    }, 15000); 
});

app.use(express.json());
app.post('/update', function(request, response){
    // shell.exec('../ShellScript/updateKubePod.sh')

    console.log(request.body);      // your JSON
    console.log(request.body.image);

    if((request.body.image == "atomportal") & (request.body.tag == "develop")) {
        
        response.json({kubeUpdate:`${request.body.image}:${request.body.tag} has been successfully updated`});   // echo the result back
        shell.exec('../ShellScript/updatePortalAPI.sh')
    }

    if((request.body.image == "atomportal_frontend") & (request.body.tag == "develop")) {
        
        response.json({kubeUpdate:`${request.body.image}:${request.body.tag} has been successfully updated`});   // echo the result back
        shell.exec('../ShellScript/updatePortalFrontend.sh')
    }

    if((request.body.image == "crmcard_ui") & (request.body.tag == "master")) {
        
        response.json({kubeUpdate:`${request.body.image}:${request.body.tag} has been successfully updated`});   // echo the result back
        shell.exec('../ShellScript/updateCrmCard.sh')
    }


    console.log(request.body.tag);
    console.log(request.body.token);
    
});

app.listen(port, () => console.log(`Listening on port ${port}!`))