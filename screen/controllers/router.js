var lastMessage = "";
var IGline = []; 

// Map routes to controller functions
module.exports = function(app) {

    // Twilio SMS webhook route
    app.post('/message', webhook);

    //send IG handle to IG script
    app.get('/instagram', hitIG);

    app.get('/', function(req, res) {
        res.render()
    })

    // app.get('/test', function(req,res){
    //     if (IGline.length > 0){
    //         res.json({"msg":IGLine[0];});

    //     }
    // });

    // function getIGline() {
    //     return app.IGline
    // }

    //----------INSTAGRAM CODE---------------
    function hitIG(request, response) {
        // make get request to instagram using lastmessage
        //for debugging purposes
        // response.send("hello")
        console.log('received request for handle');
        // var IGline = getIGline()
        console.log('IGline length is: ' + IGline.length);
        var next = null;

        //passing to front end
        if (IGline.length > 0) {
            next = IGline[0];
            console.log('next is: ' + next);
            IGline.shift();
        }
        // send instagram back to wip in response
        response.json({ "handle" : next });
    }
    //----------INSTAGRAM CODE---------------


    //----------TWILIO CODE------------------

    // Create a function to handle Twilio SMS / MMS webhook requests
    function webhook(request, response) {

        console.log("i got a message from: " + request.body.From)

            //response.send("got")
        // Get the user's phone number
        var phone = request.body.From;

        // get the text message command sent by the user
        var msg = request.body.Body || '';
        msg = msg.toLowerCase().trim().replace("@","");
        //https://www.instagram.com/wipaweeeeee
        if(msg.indexOf("/")!=-1){
            msg=msg.substring(msg.lastIndexOf("/")+1); //find the slash to the end
        }
        // var IGline = getIGline()
        IGline.push(msg);

       //debugging purposes 
        console.log(IGline)
        // Conditional logic to do different things based on the command from
        // the user
        if (msg.length > 0) {

            var responseMessage = 'Thanks for sending! Now look into my eye...'
            
            respond(responseMessage);
            
        } else {
            // If we don't recognize the command, text back with the list of
            // available commands
            var responseMessage = 'Sorry, we didn\'t understand that. '
                + 'please try again';

            respond(responseMessage);
        }

        function respond(message) {
            response.type('text/xml');
            response.render('twiml', {
                message: message
            });
        }
    }

    //----------TWILIO CODE------------------
}