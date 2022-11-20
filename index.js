const express = require('express');

const update = require('./routes/update')

const app = express();

const port = 3500;

app.get('/', (req, res) => {
    res.send('Reply from nodeJS + express');
});

// app.get('/update', (req, res) => {
//     shell.exec('../ShellScript/updateKubePod.sh')
//     res.json({kubeUpdate:"success"});
    
//     // Restart one more time with delay of 10 seconds.
//     setTimeout(function(){
//         shell.exec('../ShellScript/updateKubePod.sh')
//     }, 15000); 
// });


app.use('/update', update);

app.listen(port, () => console.log(`Listening on port ${port}!`))