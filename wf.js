//const fetch = require('node-fetch'); 
const nodeFetch = require('node-fetch')
const fetch = require('fetch-cookie')(nodeFetch)
const delay = require('delay');

async function wf(categoryId) {
    var res_array = [];
    var page = 0;
    // var categoryId = '46145'; //for living sets
    // categoryId = '1868409'; //for tv stands
    //categoryId='413893'; //for sectionals and sofas
    var productCount = -1;
    var totalPages = 9999;
    var pageSize = 96;
    var allPromises = [];
    // var ffff = await fetch('https://www.wayfair.com/?px=1', {
    //         "headers": {
    //             "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36"
    //         }
    //     });
    // var resutsfsad = await ffff;
    var txid = '';
    while (productCount === -1 || page <= totalPages) {
        var urltofetch = `https://www.wayfair.com/a/superbrowse/get_data?category_id=${categoryId}&caid=${categoryId}&clid=6&filter=&curpage=${page}&itemsperpage=${pageSize}&show_favorites_button=true&product_offset=0&load_initial_products_only=false`;
        var dis = fetch(urltofetch, {
            "credentials": "include",
            "headers": {
                "accept": "application/json",
                "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                "x-parent-txid": txid, //"otAgcF2h66K6DrKBFGogAg==",
                "x-requested-with": "XMLHttpRequest",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36"
            },
            "referrer": "https://www.wayfair.com/furniture/sb0/tv-stands-entertainment-centers-c1868409.html?itemsperpage=96&curpage=2",
            "referrerPolicy": "no-referrer-when-downgrade", "body": null, "method": "GET", "mode": "cors"
        }).then((response) => {
            return response.json();
        }).then(response => {
            //debugger;
            if (productCount != -1) {
                try {
                    res_array = res_array.concat(response.browse.browse_grid_objects);    
                } catch (error) {
                    console.log('error' + error);                    
                }
            }
            return response;
        });
        if (productCount === -1) {
            //debugger;
            var _a = await dis;
            try {
                productCount = _a.browse.product_count;
                totalPages = Math.ceil(productCount / pageSize);    
            } catch (error) {
                totalPages = 0;
            }
            
        }
        else {
            console.log(`Awaiting page: ${page}/${totalPages}, category: ${categoryId}`);
            page++;
            await dis;
            allPromises.push(dis);
        }
        //await delay(1000);
        // res_array = res_array.concat(dis.browse.browse_grid_objects);
        // productCount = dis.browse.product_count;
    }

    await Promise.all(allPromises);

    //var output = [].concat.apply([], res_array.map(x => x.browse.browse_grid_objects));
    var output = res_array

    var sortedList = output.filter(x => x && x.formatted_open_box_browse_price).sort((x, y) => parseFloat(x.formatted_open_box_browse_price.replace(/[$,]/g, '')) - parseFloat(y.formatted_open_box_browse_price.replace(/[$,]/g, '')));

    var skus = sortedList.map(x => x.sku);
    sortedList = sortedList.filter(function (v, i) { return skus.indexOf(v.sku) == i; });
    sortedList.forEach(x => { console.log(x.url) })
    console.log(`processing completed for categoryid: ${categoryId}`)
    return sortedList;
    //formatted_open_box_browse_price
}

module.exports = {
    ff: wf
};