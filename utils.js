const getPagination = (quantity, page) => {
    const quantityInteger = Number(quantity);
    const pageInteger = Number(page);

    return {
        quantity:
            Number.isInteger(quantityInteger) && quantityInteger > 0
                ? quantityInteger
                : process.env.DEFAULT_QUANTITY ?? 5,
        page:
            Number.isInteger(pageInteger) && pageInteger > 0
                ? pageInteger
                : process.env.DEFAULT_PAGE ?? 1,
    };
};

const trimAll = str => str.replace(/\s+/g, " ").trim();

module.exports = { getPagination, trimAll };
