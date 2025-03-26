export default class SaleProductDto {
    constructor(id,
        saleId,
        productId,
        productName,
        productImage,
        unitId,
        unitName,
        unitShortName,
        quantity,
        price) {
        this.id = id;
        this.saleId = saleId;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.unitId = unitId;
        this.unitName = unitName;
        this.unitShortName = unitShortName;
        this.quantity = quantity;
        this.price = price;
    }

    static fromProductDto(productDto, def = false) {
        return new SaleProductDto(
            null, // id
            null,
            productDto.id,
            productDto.name,
            productDto.image,
            productDto.unit_id,
            productDto.unit_name,
            productDto.unit_short_name,
            def ? 1 : 0,
            def ? productDto.sale_price :0,
        );
    }

    imgUrl() {
        return this.productImage.length > 0 ? `${import.meta.env.VITE_APP_BASE_URL}/storage/${this.productImage}` : null
    }
}