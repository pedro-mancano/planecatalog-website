/* eslint-disable no-use-before-define */

function exportProductsFunc(productArray) {
    var csvBase = 'Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Qty,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Status,Image Src,Image Alt Text,Image Position,Variant Image'
    var csvArray = [];
    csvArray.push(csvBase)
    var localVariantArray = [];

    //Handle,Title,Body (HTML),Vendor,Standardized Product Type,Custom Product Type,Tags,Published,Option1 Name,Option1 Value,Option2 Name,Option2 Value,Option3 Name,Option3 Value,Variant SKU,Variant Grams,Variant Inventory Tracker,Variant Inventory Policy,Variant Fulfillment Service,Variant Price,Variant Compare At Price,Variant Requires Shipping,Variant Taxable,Variant Barcode,Image Src,Image Position,Image Alt Text,Gift Card,SEO Title,SEO Description,Google Shopping / Google Product Category,Google Shopping / Gender,Google Shopping / Age Group,Google Shopping / MPN,Google Shopping / AdWords Grouping,Google Shopping / AdWords Labels,Google Shopping / Condition,Google Shopping / Custom Product,Google Shopping / Custom Label 0,Google Shopping / Custom Label 1,Google Shopping / Custom Label 2,Google Shopping / Custom Label 3,Google Shopping / Custom Label 4,Variant Image,Variant Weight Unit,Variant Tax Code,Cost per item,Status

    for (var product of productArray) {
        var variantsArray = [];
        for (var variantIndex in product.variants) {
            var variant = product.variants[variantIndex];
            if (variantIndex == 0) {
                localVariantArray = [];
                localVariantArray.push(product.handle);
                localVariantArray.push(product.title);
                localVariantArray.push(product.body_html.split('\n').join(' ').split('"').join('""'));
                localVariantArray.push(product.vendor);
                localVariantArray.push(product.type);
                localVariantArray.push(product.tags);
                localVariantArray.push('true');
                localVariantArray.push(product.options[0] ? product.options[0].name : '');
                localVariantArray.push(variant.option1);
                localVariantArray.push(product.options[1] ? product.options[1].name : '');
                localVariantArray.push(variant.option2);
                localVariantArray.push(product.options[2] ? product.options[2].name : '');
                localVariantArray.push(variant.option3);
                localVariantArray.push(variant.sku.split('\n').join(' ').split('"').join('""'));
                localVariantArray.push(variant.grams);
                localVariantArray.push('shopify');
                localVariantArray.push('');
                localVariantArray.push('continue');
                localVariantArray.push('manual');
                localVariantArray.push(variant.price);
                localVariantArray.push(variant.compare_at_price);
                localVariantArray.push(variant.requires_shipping);
                localVariantArray.push(variant.taxable);
                localVariantArray.push('');
                localVariantArray.push('draft');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push(variant.featured_image ? variant.featured_image.src : '');
            } else {
                localVariantArray.push(product.handle);
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('true');
                localVariantArray.push('');
                localVariantArray.push(variant.option1);
                localVariantArray.push('');
                localVariantArray.push(variant.option2);
                localVariantArray.push('');
                localVariantArray.push(variant.option3);
                localVariantArray.push(variant.sku.split('\n').join(' ').split('"').join('""'));
                localVariantArray.push(variant.grams);
                localVariantArray.push('shopify');
                localVariantArray.push('');
                localVariantArray.push('continue');
                localVariantArray.push('manual');
                localVariantArray.push(variant.price);
                localVariantArray.push(variant.compare_at_price);
                localVariantArray.push(variant.requires_shipping);
                localVariantArray.push(variant.taxable);
                localVariantArray.push('');
                localVariantArray.push('draft');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                var imageURL = '';
                for (var image of product.images) {
                    if (image.variant_ids.includes(variant.id)) {
                        imageURL = image.src;
                    }
                }
                localVariantArray.push(imageURL ? imageURL : '');
            }
            variantsArray.push(localVariantArray);
        }
        for (var imageIndex in product.images) {
            var imageObject = product.images[imageIndex];
            if (variantsArray[imageIndex]) {
                var objectProduct = variantsArray[imageIndex];
                objectProduct[objectProduct.length - 4] = imageObject.src;
                objectProduct[objectProduct.length - 3] = imageObject.alt ? imageObject.alt.split('\n').join(' ').split('"').join('""') : "";
                objectProduct[objectProduct.length - 2] = imageObject.position;
            } else {
                localVariantArray = [];
                localVariantArray.push(product.handle);
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push('');
                localVariantArray.push(imageObject.src);
                localVariantArray.push(imageObject.position);
                localVariantArray.push(imageObject.alt);
                localVariantArray.push('');
                variantsArray.push(localVariantArray);
            }
        }
        variantsArray = variantsArray.map(localArray => localArray.map(f => `"${f?f:''}"`).join(','));
        csvArray = csvArray.concat(variantsArray);
    }

    var blob = new Blob([csvArray.join('\n')], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, "product_exports.csv");
}

function exportProducts(productArray) {
    exportProductsFunc.name;

    var csvObject = new CSVObject([
        "Handle",
        "Title",
        "Body (HTML)",
        "Vendor",
        "Type",
        "Tags",
        "Published",
        "Option1 Name",
        "Option1 Value",
        "Option2 Name",
        "Option2 Value",
        "Option3 Name",
        "Option3 Value",
        "Variant SKU",
        "Variant Grams",
        "Variant Inventory Tracker",
        "Variant Inventory Qty",
        "Variant Inventory Policy",
        "Variant Fulfillment Service",
        "Variant Price",
        "Variant Compare At Price",
        "Variant Requires Shipping",
        "Variant Taxable",
        "Variant Barcode",
        "Status",
        "Image Src",
        "Image Alt Text",
        "Image Position",
        "Variant Image"
    ]);

    var allProductsArray = [];

    for (var product of productArray) {
        var variantProductCSVRow = [];
        for (var variant of product.variants) {
            var singleProduct = [];
            if (product.variants.indexOf(variant) == 0) {
                singleProduct.push(product.handle);
                singleProduct.push(product.title);
                singleProduct.push(product.body_html.split('\n').join(' '));
                singleProduct.push(product.vendor);
                singleProduct.push(product.product_type);
                singleProduct.push(product.tags ? product.tags.join(' ') : '');
                singleProduct.push('true');
                singleProduct.push(product.options[0] ? product.options[0].name : '');
                singleProduct.push(`${variant.option1||''}`);
                singleProduct.push(product.options[1] ? product.options[1].name : '');
                singleProduct.push(`${variant.option2||''}`);
                singleProduct.push(product.options[2] ? product.options[2].name : '');
                singleProduct.push(`${variant.option3||''}`);
                singleProduct.push(variant.sku ? variant.sku.split('\n').join(' ') : '');
                singleProduct.push(`${variant.grams}`)
                singleProduct.push('shopify');
                singleProduct.push('');
                singleProduct.push('continue');
                singleProduct.push('manual');
                singleProduct.push(`${variant.price}`);
                singleProduct.push(`${variant.compare_at_price||(variant.price)*1.5||''}`);
                singleProduct.push(`${variant.requires_shipping}`);
                singleProduct.push(`${variant.taxable}`);
                singleProduct.push('');
                singleProduct.push('draft');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push(variant.featured_image ? variant.featured_image.src : '');
            } else {
                var imageURL = '';
                for (var image of product.images) {
                    if (image.variant_ids.includes(variant.id)) {
                        imageURL = image.src;
                    }
                }
                singleProduct.push(product.handle);
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('true');
                singleProduct.push('');
                singleProduct.push(`${variant.option1||''}`);
                singleProduct.push('');
                singleProduct.push(`${variant.option2||''}`);
                singleProduct.push('');
                singleProduct.push(`${variant.option3||''}`);
                singleProduct.push(variant.sku ? variant.sku.split('\n').join(' ') : '');
                singleProduct.push(`${variant.grams}`);
                singleProduct.push('shopify');
                singleProduct.push('');
                singleProduct.push('continue');
                singleProduct.push('manual');
                singleProduct.push(`${variant.price}`);
                singleProduct.push(`${variant.compare_at_price||(variant.price)*1.5||''}`);
                singleProduct.push(`${variant.requires_shipping}`);
                singleProduct.push(`${variant.taxable}`);
                singleProduct.push('');
                singleProduct.push('draft');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push('');
                singleProduct.push(imageURL || '');
            }
            variantProductCSVRow.push(singleProduct);
        }
        for (var imageIndex in product.images) {
            var imageObject = product.images[imageIndex];
            if (variantProductCSVRow[imageIndex]) {
                var objectProduct = variantProductCSVRow[imageIndex];
                objectProduct[objectProduct.length - 4] = imageObject.src;
                objectProduct[objectProduct.length - 3] = imageObject.alt || '';
                objectProduct[objectProduct.length - 2] = `${imageObject.position}`;
            } else {
                var singleProductJustImage = [];
                singleProductJustImage.push(product.handle);
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push('');
                singleProductJustImage.push(imageObject.src);
                singleProductJustImage.push(`${imageObject.position}`);
                singleProductJustImage.push(imageObject.alt);
                singleProductJustImage.push('');
                variantProductCSVRow.push(singleProductJustImage);
            }
        }
        allProductsArray.push(variantProductCSVRow);
    }


    allProductsArray.forEach(function (rowArray) {
        for (var row of rowArray) {
            csvObject.addRow(row);
        }
    });

    var blob = csvObject.getBlob();
    saveAs(blob, "products.csv");
}


class CSVObject {

    constructor(header) {
        this.headers = header;
        this.data = [];
    }

    addRow(row) {
        if (row.length != this.headers.length) {
            throw new Error('Row length does not match headers length', row);
        }

        if (row[19] == 'null') {
            //console.log(row);
        }

        row = row.map(function (value) {
            if (!value || value === '') {
                return '';
            } else {
                value = value.split('"').join('""');

                if (value.charAt(0) != '"') {
                    value = '"' + value;
                } else if (value.charAt(1) == '"') {
                    value = '"' + value;
                }

                if (value.charAt(value.length - 1) != '"') {
                    value = value + '"';
                } else if (value.charAt(value.length - 2) == '"') {
                    value = value + '"';
                }

                return value;
            }
        })

        this.data.push(row.join(','));
    }

    getCSV() {
        var length = this.headers.length;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].split(',').length < length) {
                throw new Error('Row ' + i + ' is not the same length as the headers');
            }
        }

        return this.headers.join(',') + '\r\n' + this.data.join('\r\n');
    }

    getBlob() {
        return new Blob(["\uFEFF" + this.getCSV()], {
            type: "text/plain;charset=utf-8"
        });
    }

}



function saveAs(blob, filename) {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style = "display: none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

export default exportProducts;