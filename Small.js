const Data = importModule("Data");
const data = await Data.fetchData();

function createInfoStack(stack, usage, cost) {
    const infoStack = stack.addStack();
    infoStack.setPadding(0, 0, 0, 0);
    infoStack.spacing = 0;
    infoStack.layoutVertically();
    infoStack.addText("Total Usage");
    infoStack.addText(`${usage} kW`);
    infoStack.addText("Total Cost");
    infoStack.addText(`${cost} JPY`);
}

const readingTotal = data
    .map(el => el.value)
    .reduce((prev, curr) => prev + curr, 0)
    .toFixed(2);
const costTotal = data
    .map(el => el.costEstimate)
    .reduce((prev, curr) => prev + curr, 0)
    .toFixed(2);

const widget = new ListWidget();
const smallStack = widget.addStack();
createInfoStack(smallStack, readingTotal, costTotal);
Script.setWidget(widget);
Script.complete();
