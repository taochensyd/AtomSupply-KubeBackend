/*

    This is guide to set up the API endpoint.

*/

/* 
    Note: This secion has to be in same directory.

    Environment
    This is developed using JavaScript, with runtime environment of Node.JS and express framework.
    In the Ubuntu/Linux terminal(or SSH), run following command to install node and express

    Command:
    sudo apt install nodejs
    sudo apt install express.


    package.json is the file store all the meta data, all the package/dependencies will be listed here. Will below command it will install all the package and dependencies inside node_module folder.
    npm install

*/

/*

    Deployment
    PM2 package is used for deployment and host this API Endpoint.
    Link: https://www.npmjs.com/package/pm2

    Install globally command:
    npm install pm2 -g

    Managing Command:
    $ pm2 stop     <app_name|namespace|id|'all'|json_conf>
    $ pm2 restart  <app_name|namespace|id|'all'|json_conf>
    $ pm2 delete   <app_name|namespace|id|'all'|json_conf>


    For example, the file in this APi is index.js
    pm2 start index.js
    Above will serve the page with a port definded inside the js file. Port is 3500 in this case.
    Below command will stop serving the page, any changes to the index.js file will need to stop first and then start.
    pm2 stopo index.js



*/

