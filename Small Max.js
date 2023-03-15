const Data = importModule("Data");
const data = await Data.fetchData();

function createInfoStack(stack, usage, cost) {
    const infoStack = stack.addStack();
    infoStack.setPadding(0, 0, 0, 0);
    infoStack.spacing = 0;
    infoStack.layoutVertically();
    infoStack.addText("Highest Usage");
    infoStack.addText(`${usage} kW`);
    infoStack.addText("Highest Cost");
    infoStack.addText(`${cost} JPY`);
}

const readingMaxValue = Math.max(...data.map(el => el.value)).toFixed(2);
const costMaxValue = Math.max(...data.map(el => el.costEstimate)).toFixed(2);

const widget = new ListWidget();
const smallStack = widget.addStack();
createInfoStack(smallStack, readingMaxValue, costMaxValue);
Script.setWidget(widget);
Script.complete();
