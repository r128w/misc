
points = [] # formatted as [[x,y], [x,y], [x,y]]

xValues = [16, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 70] # values to get y values for

samplePoints = [[16, 15], [18, 17], [20, 18], [22, 19], [25, 21], [28, 23], [30, 25], [35, 28], [40, 30], [45, 32], [50, 35], [60, 45], [70, 55]]

def getValues():
    print("Please provide the lowest non-creepy dateable age for someone of age <x>:")
    for value in xValues:
        points.append([value, int(input(str(value) + " > "))])
    return

# getValues()
# print(points)


def plotPoints(toPlot):
    maxX = 0
    maxY = 0
    minX = 10000000
    minY = 10000000
    for point in toPlot:
        if point[0] > maxX:
            maxX = point[0] + 1
        if point[1] > maxY:
            maxY = point[1] + 1
        if point[0] < minX:
            minX = point[0] - 1
        if point[1] < minY:
            minY = point[1] - 1

    yAxisLabelLength = 0
    dummyMaxY = maxY
    while dummyMaxY >= 1:
        yAxisLabelLength += 1
        dummyMaxY /= 10
    
    for y in reversed(range(minY,maxY)):
        thisYLabelLength = 0
        dummyY = y
        while dummyY >= 1:
            thisYLabelLength += 1
            dummyY /= 10
        
        line = ""

        for i in range(0,yAxisLabelLength-thisYLabelLength):
            line+=" "

        line += str(y) + "|"
        for x in range(minX, maxX):
            thisPointChar = "  "
            for point in toPlot:
                if point[0] == x and y < point[1]:
                    thisPointChar = "||"
                if point[1] == y and x < point[0]:
                    thisPointChar = "=="
                if point[0] == x and point[1] == y:
                    thisPointChar = "[]"
            line+=thisPointChar
        print(line)

    bottomBorder = ""
    for i in range(0,yAxisLabelLength):
        bottomBorder += " "
    bottomBorder += "+"
    while len(bottomBorder) < ((maxX-minX)*2) + yAxisLabelLength + 1:
        bottomBorder+="-"
    print(bottomBorder)


    xAxisLabel = ""
    for i in range(0,yAxisLabelLength):
        xAxisLabel += " "
    xAxisLabel+="   "
    while len(xAxisLabel) < ((maxX-minX)*2) + yAxisLabelLength + 1:
        xAxisLabel+=str(int(((len(xAxisLabel)-3)/2)+minX)) + " "
    print(xAxisLabel)


plotPoints(samplePoints)
