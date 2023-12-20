/* eslint no-use-before-define: 0 */
declare let epson: any;
let printer = undefined;
let ePosDev = undefined;

function conn(ip: string, port = '8008') {
    if (window.location.protocol === 'https:') {
        port = '8043'
    }
    return new Promise((resolve, reject) => {
        if (!ePosDev) {
            console.log('creating new ePOSDevice');
            ePosDev = new epson.ePOSDevice();
        }

        if (!printer && !ePosDev?.['isConnected']()) {
            console.log('ePosDev.connect');
            ePosDev.connect(ip, port, function (res: any) {
                if ((res === 'OK') || (res === 'SSL_CONNECT_OK')) {
                    const opt = {
                        'crypto': false,
                        'buffer': false
                    };
                    ePosDev.createDevice('local_printer', ePosDev.DEVICE_TYPE_PRINTER, opt, function (device, retcode) {
                        if (retcode === 'OK') {
                            resolve(device);
                        } else {
                            reject(new Error(`Unable to create printer device, err: ${retcode}`));
                        }
                    });
                } else {
                    reject(new Error(`Unable to connect to printer, err: ${res}`));
                }
            }, { 'eposprint': true });

            ePosDev.onreconnect = function (res) {
                console.log('onreconnect', res);
            };
        } else {
            resolve(printer);
        }
    });
}

export async function epsonPrint(ip: string, image: string, status?: (status) => void) {
    printer = await conn(ip);
    printer.timeout = 60000;
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        // printer?.['startMonitor']();
        printer.onstatuschange = function (s) {
            console.log('onstatuschange', s);
            status({ onstatuschange: s });
        };
        printer.oncoveropen = function () {
            console.log('coveropen');
            status({ coveropen: true });
        };
        printer.onreceive = function (res: {
            'success': boolean,
            'code': string,
            'status': number,
            'battery': number,
            'printjobid': string
        }) {
            console.log('onreceive', res);
            if (res.success) {
                resolve(res);
            } else {
                reject(new Error(`Print Failed, err: ${JSON.stringify(res)}`));
            }
            canvas.remove();
        };

        if (canvas?.getContext('2d')) {
            const ctx = canvas?.getContext('2d');
            const img = new Image();
            img.src = image;
            img.crossOrigin = 'Anonymous';
            img.addEventListener('load', () => {
                canvas.setAttribute('height', `${img.height}`);
                canvas.setAttribute('width', `${img.width}`);
                ctx.drawImage(img, 0, 0);
                const cut = true;
                const mode = printer.MODE_MONO;
                printer.print(canvas, cut, mode);
            }, false,);
        }
    });

}
