var commands = [
    {
        name: "echo",
        scheme: "echo $input",
        args: [
            {
                name: "input",
                type: "string",
            }
        ],
        handler: ({input}) => {
            return input;
        }
    }
]

var argumentTypes = [
    {
        type: "string",
        replace: "([a-z]+)",
        transform: (arg) => {
            return arg;
        }
    },
    {
        type: "number",
        replace: "([0-9]+)",
        transform: (arg) => {
            return parseInt(arg);
        }
    }
]

var cmd = (input) => {
    // replace any names in command lists with their regex
    for (let c of commands) {
        var reg = c.scheme;
        for(let arg of c.args) {
            var argumentType = argumentTypes.find(a => a.type === arg.type);
            if(argumentType == undefined) {
                console.log("unsupported argumenttype");
                return;
            }
        }
        reg = reg.replace("$" + arg.name, argumentType.replace);
    
        var regExp = new RegExp(reg);
        var match = input.match(regExp);
        // interpret into a function call
        if(match) {
            match.shift(); // I'm currently assuming this get's rid of the command's name
            var paramobj = {};
            for(var i = 0; i < c.args.length; i++) { //loop through all arguments
                var argumentType = argumentTypes.find(a => a.type === c.args[i].type);
                paramObj[c.args[i].name] = argumentType.transform(match[i]);
            }
            return c.handler(paramObj);
        }
    }
    console.log("no matching command found");
}

