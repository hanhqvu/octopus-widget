function drawChart(data, maximum, deviation) {
    const drawContext = new DrawContext();
    drawContext.size = new Size(850, 350);
    drawContext.opaque = false;
    drawContext.respectScreenScale = true;
    drawContext.setTextAlignedRight();
    drawContext.setFont(Font.mediumRoundedSystemFont(14));
    drawContext.setTextColor(Color.gray());
    const bottomPadding = 20;
    const leadingPadding = 62;

    const verticalAxis = new Path();
    for (let i = 0; i <= 4; i++) {
        const yPoint =
            drawContext.size.height -
            (((drawContext.size.height - bottomPadding * 2) / 4) * i +
                bottomPadding);
        verticalAxis.move(new Point(leadingPadding, yPoint));
        verticalAxis.addLine(new Point(drawContext.size.width, yPoint));
        const point = (deviation * i).toFixed(2);
        drawContext.drawTextInRect(
            String(point),
            new Rect(0, yPoint - 12, 60, 20),
        );
    }

    drawContext.setTextAlignedCenter();

    const availableHeight = drawContext.size.height - bottomPadding * 2;
    const spacing = 4;
    const barWidth = 20;

    let textHeight = 20;
    const textWidth = barWidth;

    data.forEach((element, index) => {
        const path = new Path();
        const x = index * spacing + index * barWidth + leadingPadding;
        const heightFactor = element.value / maximum;
        const barHeight = heightFactor * availableHeight;
        const rect = new Rect(
            x,
            drawContext.size.height - barHeight - bottomPadding,
            barWidth,
            barHeight,
        );
        path.addRoundedRect(rect, 4, 4);
        drawContext.addPath(path);

        const currTime = new Date();
        const currDate = currTime.getDate();

        if (element.date === currDate) {
            drawContext.setFillColor(Color.blue());
        } else if (element.value.toFixed(2) === maximum && element.date !== 1) {
            drawContext.setFillColor(Color.red());
        } else {
            drawContext.setFillColor(Color.green());
        }

        drawContext.fillPath();

        const textRect = new Rect(
            x,
            drawContext.size.height - bottomPadding,
            textWidth,
            textHeight,
        );
        const label = element.date;

        drawContext.drawTextInRect(`${label}`, textRect);
    });

    return drawContext.getImage();
}
