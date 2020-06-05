/**
 * Includes
 */
const commandLineArgs = require('command-line-args');
const SmartCielo = require('node-smartcielo');
var http = require('http');

/**
 * Constants
 */

const OPTION_DEFINITIONS = [
    { name: 'port', alias: 'l', type: String },
    { name: 'username', alias: 'u', type: String },
    { name: 'password', alias: 'p', type: String },
    { name: 'ip', alias: 'i', type: String }
];
const OPTIONS = commandLineArgs(OPTION_DEFINITIONS);

/**
 * Helper Functions
 */
function extractCommandAndValueFromRequest(req, pathComponents) {
    var command = null;
    var value = null;
    pathComponents.forEach(pathComponent => {
        if ( (req.url === '/' + pathComponent) || (req.url.startsWith('/' + pathComponent + '/')) ) {
            command = pathComponent;
            value = req.url.startsWith('/' + pathComponent + '/') ? req.url.replace('/' + pathComponent + '/', '') : null;
        }
    });
    return { command, value };
}

function sendQueryResponse(res, key, value) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var responseObject = {};
    responseObject[key] = value;
    res.write(JSON.stringify(responseObject));
    res.end();
}

function sendCommandSuccessResponse(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ 'success': true }));
    res.end();
}

function sendErrorResponse(res, req) {
    res.end(JSON.stringify({ 'error': 'Invalid Request: ' + req.url }));
}

/**
 * Main Program
 */
const hvac = new SmartCielo(OPTIONS.username, OPTIONS.password, OPTIONS.ip,
    commandedState => {
        console.log('Commanded State Change:', JSON.stringify(commandedState));
    },
    roomTemperature => {
        console.log('Updated Room Temperature:', roomTemperature);
    },
    err => {
        console.error('Communication Error:', err);
    });
console.log('Connecting...');
hvac.waitForConnection.then(_ => {
    console.log('Connected.');
    var server = http.createServer(function (req, res) {
        console.log('Received request:', req.url);
        var methodName = null;
        var error = false;
        var { command, value } = extractCommandAndValueFromRequest(req, ['power', 'mode', 'roomTemperature', 'temperature', 'fanSpeed']);
        console.log('Extracted command:', command, 'value:', value);
        switch (command) {
            case 'power':
                switch (value) {
                    case null: methodName = 'getPower'; break;
                    case 'off': methodName = 'sendPowerOff'; value = undefined; break;
                    case 'on': methodName = 'sendPowerOn'; value = undefined; break;
                    default: error = true; break;
                }
                break;
            case 'mode':
                switch (value) {
                    case null: methodName = 'getMode'; break;
                    case 'cool': methodName = 'sendMode'; break;
                    case 'dry': methodName = 'sendMode'; break;
                    case 'fan': methodName = 'sendMode'; break;
                    case 'auto': methodName = 'sendMode'; break;
                    case 'heat': methodName = 'sendMode'; break;
                    default: error = true; break;
                }
                break;
            case 'fanSpeed':
                switch (value) {
                    case null: methodName = 'getFanSpeed'; break;
                    case 'auto': methodName = 'sendFanSpeed'; break;
                    case 'low': methodName = 'sendFanSpeed'; break;
                    case 'med': methodName = 'sendFanSpeed'; break;
                    case 'high': methodName = 'sendFanSpeed'; break;
                    default: error = true; break;
                }
                break;
            case 'temperature':
                switch (value) {
                    case null: methodName = 'getTemperature'; break;
                    default: methodName = 'sendTemperature'; break;
                }
                break;
            case 'roomTemperature':
                switch (value) {
                    case null: methodName = 'getRoomTemperature'; break;
                    default: error = true; break;
                }
                break;
            default:
                error = true;
                break;
        }
        if (!error) {
            if (value === null) {
                sendQueryResponse(res, command, hvac[methodName]());
            } else if (value === undefined) {
                hvac[methodName](_ => { sendCommandSuccessResponse(res); }, err => { console.error(err); });
            } else {
                hvac[methodName](value, _ => { sendCommandSuccessResponse(res); }, err => { console.error(err); });
            }
        } else {
            sendErrorResponse(res, req);
        }
    });
    server.listen(OPTIONS.port);
    console.log('Node.js web server running on port:', OPTIONS.port);
}, err => {
    console.error(err);
});
