/*!
 * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
 * Copyright (c) 2015, Curtis Bratton
 * All rights reserved.
 */
(function(d3) {
    var idGenerator = (function() {
        var count = 0;
        return function(prefix) {
            return prefix + "-" + count++;
        };
    })();

    var defaultConfig = {
        // Values
        minValue: 0, // The gauge minimum value.
        maxValue: 100, // The gauge maximum value.

        // Styles
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: "#178BCA", // The color of the outer circle.
        backgroundColor: null, // The color of the background
        waveColor: "#178BCA", // The color of the fill wave.
        width: 0, // You might want to set the width and height if it is not detected properly by the plugin
        height: 0,

        // Gradient
        fillWithGradient: false, // Controls if the wave should be filled with gradient
        gradientPoints: [0, 0, 1., 1.], //  [x1, y1, x2, y2], coordinates for gradient start point(x1,y1) and final point(x2,y2)
        gradientFromColor: "#FFF",
        gradientToColor: "#000",

        // Waves
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.

        // Animations
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveRiseAtStart: true, // If set to false and waveRise at true, will disable only the initial animation
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading and updating. If false, the final value is displayed.
        valueCountUpAtStart: true, // If set to false and valueCountUp at true, will disable only the initial animation

        // Text
        textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        displayPercent: true, // If true, a % symbol is displayed after the value.
        textColor: "#045681", // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8", // The color of the value text when the wave overlaps it.
    };

    d3.liquidfillgauge = function(g, value, settings) {
        // Handle configuration
        var config = d3.map(defaultConfig);
        d3.map(settings).each(function(val, key) {
            config.set(key, val);
        });

        g.each(function(d) {
            var gauge = d3.select(this);

            var width = config.get("width") !== 0 ? config.get("width") : parseInt(gauge.style("width"));
            var height = config.get("height") !== 0 ? config.get("height") : parseInt(gauge.style("height"));
            var radius = Math.min(width, height) / 2;
            var locationX = width / 2 - radius;
            var locationY = height / 2 - radius;
            var fillPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), value)) / config.get("maxValue");

            var waveHeightScale;
            if (config.get("waveHeightScaling")) {
              waveHeightScale = d3.scaleLinear()
                  .range([0, config.get("waveHeight"), 0])
                  .domain([0, 50, 100]);
            } else {
                waveHeightScale = d3.scaleLinear()
                  .range([config.get("waveHeight"), config.get("waveHeight")])
                  .domain([0, 100]);
            }

            var textPixels = (config.get("textSize") * radius / 2);
            var textFinalValue = parseFloat(value).toFixed(2);
            var textStartValue = config.get("valueCountUp") ? config.get("minValue") : textFinalValue;
            var percentText = config.get("displayPercent") ? "%" : "";
            var circleThickness = config.get("circleThickness") * radius;
            var circleFillGap = config.get("circleFillGap") * radius;
            var fillCircleMargin = circleThickness + circleFillGap;
            var fillCircleRadius = radius - fillCircleMargin;
            var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

            var waveLength = fillCircleRadius * 2 / config.get("waveCount");
            var waveClipCount = 1 + config.get("waveCount");
            var waveClipWidth = waveLength * waveClipCount;

            // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
            var textRounder = function(value) {
                return Math.round(value);
            };
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(1);
                };
            }
            if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
                textRounder = function(value) {
                    return parseFloat(value).toFixed(2);
                };
            }

            // Data for building the clip wave area.
            var data = [];
            for (var i = 0; i <= 40 * waveClipCount; i++) {
                data.push({
                    x: i / (40 * waveClipCount),
                    y: (i / (40))
                });
            }

            // Scales for drawing the outer circle.
            var gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
            var gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);

            // Scales for controlling the size of the clipping path.
            var waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
            var waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);

            // Scales for controlling the position of the clipping path.
            var waveRiseScale = d3.scaleLinear()
            // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
            // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
            // circle at 100%.
              .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
              .domain([0, 1]);
            var waveAnimateScale = d3.scaleLinear()
              .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
              .domain([0, 1]);

            // Scale for controlling the position of the text within the gauge.
            var textRiseScaleY = d3.scaleLinear()
              .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
              .domain([0, 1]);

            // Center the gauge within the parent
            var gaugeGroup = gauge.append("g")
              .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

            // Draw the background circle
            if (config.get("backgroundColor")) {
                gaugeGroup.append("circle")
                  .attr("r", radius)
                  .style("fill", config.get("backgroundColor"))
                  .attr('transform', 'translate(' + radius + ',' + radius + ')');
            }

            // Draw the outer circle.
            var gaugeCircleArc = d3.arc()
              .startAngle(gaugeCircleX(0))
              .endAngle(gaugeCircleX(1))
              .outerRadius(gaugeCircleY(radius))
              .innerRadius(gaugeCircleY(radius - circleThickness));
            gaugeGroup.append("path")
              .attr("d", gaugeCircleArc)
              .style("fill", config.get("circleColor"))
              .attr('transform', 'translate(' + radius + ',' + radius + ')');

            // Text where the wave does not overlap.
            var text1 = gaugeGroup.append("text")
              .attr("class", "liquidFillGaugeText")
              .attr("text-anchor", "middle")
              .attr("font-size", textPixels + "px")
              .style("fill", config.get("textColor"))
              .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

            // The clipping wave area.
            var clipArea = d3.area()
              .x(function(d) {
                  return waveScaleX(d.x);
              })
              .y0(function(d) {
                  return waveScaleY(Math.sin(Math.PI * 2 * config.get("waveOffset") * -1 + Math.PI * 2 * (1 - config.get("waveCount")) + d.y * 2 * Math.PI));
              })
              .y1(function(d) {
                  return (fillCircleRadius * 2 + waveHeight);
              });

            var gaugeGroupDefs = gaugeGroup.append("defs");

            var clipId = idGenerator("clipWave");
            var waveGroup = gaugeGroupDefs
              .append("clipPath")
              .attr("id", clipId);
            var wave = waveGroup.append("path")
              .datum(data)
              .attr("d", clipArea);

            // The inner circle with the clipping wave attached.
            var fillCircleGroup = gaugeGroup.append("g")
              .attr("clip-path", "url(#" + clipId + ")");
            fillCircleGroup.append("circle")
              .attr("cx", radius)
              .attr("cy", radius)
              .attr("r", fillCircleRadius);

            if (config.get("fillWithGradient")) {
                var points = config.get("gradientPoints");
                var gradientId = idGenerator("linearGradient");
                var grad = gaugeGroupDefs.append("linearGradient")
                  .attr("id", gradientId)
                  .attr("x1", points[0])
                  .attr("y1", points[1])
                  .attr("x2", points[2])
                  .attr("y2", points[3]);
                grad.append("stop")
                  .attr("offset", "0")
                  .attr("stop-color", config.get("gradientFromColor"));
                grad.append("stop")
                  .attr("offset", "1")
                  .attr("stop-color", config.get("gradientToColor"));

                fillCircleGroup.style("fill", "url(#" + gradientId + ")");
            } else {
                fillCircleGroup.style("fill", config.get("waveColor"));
            }

            // Text where the wave does overlap.
            var text2 = fillCircleGroup.append("text")
              .attr("class", "liquidFillGaugeText")
              .attr("text-anchor", "middle")
              .attr("font-size", textPixels + "px")
              .style("fill", config.get("waveTextColor"))
              .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.get("textVertPosition")) + ')');

            // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
            var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;

            if (config.get("waveAnimate")) {
                var animateWave = function() {
                    wave.transition()
                      .duration(config.get("waveAnimateTime"))
                      .ease(d3.easeLinear)
                      .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                      .on("end", function() {
                          wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                          animateWave();
                      });
                };
                animateWave();
            }

            var transition = function(from, to, riseWave, animateText) {
                // Update texts and animate
                if (animateText) {
                    var textTween = function() {
                        var that = d3.select(this);
                        var i = d3.interpolate(from, to);
                        return function(t) {
                            that.text(textRounder(i(t)) + percentText);
                        };
                    };
                    text1.transition()
                      .duration(config.get("waveRiseTime"))
                      .tween("text", textTween);
                    text2.transition()
                      .duration(config.get("waveRiseTime"))
                      .tween("text", textTween);
                } else {
                    text1.text(textRounder(to) + percentText);
                    text2.text(textRounder(to) + percentText);
                }

                // Update the wave
                toPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), to)) / config.get("maxValue");
                fromPercent = Math.max(config.get("minValue"), Math.min(config.get("maxValue"), from)) / config.get("maxValue");

                if (riseWave) {
                    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fromPercent) + ')')
                      .transition()
                      .duration(config.get("waveRiseTime"))
                      .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent) + ')');
                } else {
                    waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(toPercent) + ')');
                }
            };

            transition(
              textStartValue,
              textFinalValue,
              config.get("waveRise") && config.get("waveRiseAtStart"),
              config.get("valueCountUp") && config.get("valueCountUpAtStart")
            );

            // Event to update the value
            gauge.on("valueChanged", function(newValue) {
                transition(value, newValue, config.get("waveRise"), config.get("valueCountUp"));
                value = newValue;
            });

            gauge.on("destroy", function() {
                // Stop all the transitions
                text1.interrupt().transition();
                text2.interrupt().transition();
                waveGroup.interrupt().transition();
                wave.interrupt().transition();

                // Unattach events
                gauge.on("valueChanged", null);
                gauge.on("destroy", null);
            });
        });
    };
});


// /*!
//  * @license Open source under BSD 2-clause (http://choosealicense.com/licenses/bsd-2-clause/)
//  * Copyright (c) 2015, Curtis Bratton
//  * All rights reserved.
//  *
//  * Liquid Fill Gauge v1.1
//  */
// function liquidFillGaugeDefaultSettings() {
// 	return {
// 		minValue: 0, // The gauge minimum value.
// 		maxValue: 100, // The gauge maximum value.
// 		circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
// 		circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
// 		circleColor: "#178BCA", // The color of the outer circle.
// 		waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
// 		waveCount: 1, // The number of full waves per width of the wave circle.
// 		waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
// 		waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
// 		waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
// 		waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
// 		waveAnimate: true, // Controls if the wave scrolls or is static.
// 		waveColor: "#178BCA", // The color of the fill wave.
// 		waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
// 		textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
// 		textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
// 		valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
// 		displayPercent: true, // If true, a % symbol is displayed after the value.
// 		textColor: "#045681", // The color of the value text when the wave does not overlap it.
// 		waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
// 	};
// }
//
// function loadLiquidFillGauge(elementId, value, config) {
// 	if (config == null) config = liquidFillGaugeDefaultSettings();
//
// 	var gauge = d3.select("#" + elementId);
// 	var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height"))) / 2;
// 	var locationX = parseInt(gauge.style("width")) / 2 - radius;
// 	var locationY = parseInt(gauge.style("height")) / 2 - radius;
// 	var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
//
// 	var waveHeightScale;
// 	if (config.waveHeightScaling) {
// 		waveHeightScale = d3.scaleLinear()
// 			.range([0, config.waveHeight, 0])
// 			.domain([0, 50, 100]);
// 	} else {
// 		waveHeightScale = d3.scaleLinear()
// 			.range([config.waveHeight, config.waveHeight])
// 			.domain([0, 100]);
// 	}
//
// 	var textPixels = (config.textSize * radius / 2);
// 	var textFinalValue = parseFloat(value).toFixed(2);
// 	var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
// 	var percentText = config.displayPercent ? "%" : "";
// 	var circleThickness = config.circleThickness * radius;
// 	var circleFillGap = config.circleFillGap * radius;
// 	var fillCircleMargin = circleThickness + circleFillGap;
// 	var fillCircleRadius = radius - fillCircleMargin;
// 	var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
//
// 	var waveLength = fillCircleRadius * 2 / config.waveCount;
// 	var waveClipCount = 1 + config.waveCount;
// 	var waveClipWidth = waveLength * waveClipCount;
//
// 	// Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
// 	var textRounder = function(value) {
// 		return Math.round(value);
// 	};
// 	if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
// 		textRounder = function(value) {
// 			return parseFloat(value).toFixed(1);
// 		};
// 	}
// 	if (parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))) {
// 		textRounder = function(value) {
// 			return parseFloat(value).toFixed(2);
// 		};
// 	}
//
// 	// Data for building the clip wave area.
// 	var data = [];
// 	for (var i = 0; i <= 40 * waveClipCount; i++) {
// 		data.push({
// 			x: i / (40 * waveClipCount),
// 			y: (i / (40))
// 		});
// 	}
//
// 	// Scales for drawing the outer circle.
// 	var gaugeCircleX = d3.scaleLinear().range([0, 2 * Math.PI]).domain([0, 1]);
// 	var gaugeCircleY = d3.scaleLinear().range([0, radius]).domain([0, radius]);
//
// 	// Scales for controlling the size of the clipping path.
// 	var waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
// 	var waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);
//
// 	// Scales for controlling the position of the clipping path.
// 	var waveRiseScale = d3.scaleLinear()
// 		// The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
// 		// such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
// 		// circle at 100%.
// 		.range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
// 		.domain([0, 1]);
// 	var waveAnimateScale = d3.scaleLinear()
// 		.range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
// 		.domain([0, 1]);
//
// 	// Scale for controlling the position of the text within the gauge.
// 	var textRiseScaleY = d3.scaleLinear()
// 		.range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
// 		.domain([0, 1]);
//
// 	// Center the gauge within the parent SVG.
// 	var gaugeGroup = gauge.append("g")
// 		.attr('transform', 'translate(' + locationX + ',' + locationY + ')');
//
// 	// Draw the outer circle.
// 	var gaugeCircleArc = d3.arc()
// 		.startAngle(gaugeCircleX(0))
// 		.endAngle(gaugeCircleX(1))
// 		.outerRadius(gaugeCircleY(radius))
// 		.innerRadius(gaugeCircleY(radius - circleThickness));
// 	gaugeGroup.append("path")
// 		.attr("d", gaugeCircleArc)
// 		.style("fill", config.circleColor)
// 		.attr('transform', 'translate(' + radius + ',' + radius + ')');
//
// 	// Text where the wave does not overlap.
// 	var text1 = gaugeGroup.append("text")
// 		.text(textRounder(textStartValue) + percentText)
// 		.attr("class", "liquidFillGaugeText")
// 		.attr("text-anchor", "middle")
// 		.attr("font-size", textPixels + "px")
// 		.style("fill", config.textColor)
// 		.attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');
//
// 	// The clipping wave area.
// 	var clipArea = d3.area()
// 		.x(function(d) {
// 			return waveScaleX(d.x);
// 		})
// 		.y0(function(d) {
// 			return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
// 		})
// 		.y1(function(d) {
// 			return (fillCircleRadius * 2 + waveHeight);
// 		});
// 	var waveGroup = gaugeGroup.append("defs")
// 		.append("clipPath")
// 		.attr("id", "clipWave" + elementId);
// 	var wave = waveGroup.append("path")
// 		.datum(data)
// 		.attr("d", clipArea)
// 		.attr("T", 0);
//
// 	// The inner circle with the clipping wave attached.
// 	var fillCircleGroup = gaugeGroup.append("g")
// 		.attr("clip-path", "url(#clipWave" + elementId + ")");
// 	fillCircleGroup.append("circle")
// 		.attr("cx", radius)
// 		.attr("cy", radius)
// 		.attr("r", fillCircleRadius)
// 		.style("fill", config.waveColor);
//
// 	// Text where the wave does overlap.
// 	var text2 = fillCircleGroup.append("text")
// 		.text(textRounder(textStartValue) + percentText)
// 		.attr("class", "liquidFillGaugeText")
// 		.attr("text-anchor", "middle")
// 		.attr("font-size", textPixels + "px")
// 		.style("fill", config.waveTextColor)
// 		.attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');
//
// 	// Make the value count up.
// 	if (config.valueCountUp) {
// 		var textTween = function() {
// 			var i = d3.interpolate(this.textContent, textFinalValue);
// 			return function(t) {
// 				this.textContent = textRounder(i(t)) + percentText;
// 			}
// 		};
// 		text1.transition()
// 			.duration(config.waveRiseTime)
// 			.tween("text", textTween);
// 		text2.transition()
// 			.duration(config.waveRiseTime)
// 			.tween("text", textTween);
// 	}
//
// 	// Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
// 	var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
// 	if (config.waveRise) {
// 		waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
// 			.transition()
// 			.duration(config.waveRiseTime)
// 			.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
// 			.each("start", function() {
// 				wave.attr('transform', 'translate(1,0)');
// 			}); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
// 	} else {
// 		waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
// 	}
//
// 	if (config.waveAnimate) animateWave();
//
// 	function animateWave() {
// 		wave.attr('transform', 'translate(' + waveAnimateScale(wave.attr('T')) + ',0)');
// 		wave.transition()
// 			.duration(config.waveAnimateTime * (1 - wave.attr('T')))
// 			.ease('linear')
// 			.attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
// 			.attr('T', 1)
// 			.each('end', function() {
// 				wave.attr('T', 0);
// 				animateWave(config.waveAnimateTime);
// 			});
// 	}
//
// 	function GaugeUpdater() {
// 		this.update = function(value) {
// 			var newFinalValue = parseFloat(value).toFixed(2);
// 			var textRounderUpdater = function(value) {
// 				return Math.round(value);
// 			};
// 			if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
// 				textRounderUpdater = function(value) {
// 					return parseFloat(value).toFixed(1);
// 				};
// 			}
// 			if (parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))) {
// 				textRounderUpdater = function(value) {
// 					return parseFloat(value).toFixed(2);
// 				};
// 			}
//
// 			var textTween = function() {
// 				var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
// 				return function(t) {
// 					this.textContent = textRounderUpdater(i(t)) + percentText;
// 				}
// 			};
//
// 			text1.transition()
// 				.duration(config.waveRiseTime)
// 				.tween("text", textTween);
// 			text2.transition()
// 				.duration(config.waveRiseTime)
// 				.tween("text", textTween);
//
// 			var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;
// 			var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);
// 			var waveRiseScale = d3.scaleLinear()
// 				// The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
// 				// such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
// 				// circle at 100%.
// 				.range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
// 				.domain([0, 1]);
// 			var newHeight = waveRiseScale(fillPercent);
// 			var waveScaleX = d3.scaleLinear().range([0, waveClipWidth]).domain([0, 1]);
// 			var waveScaleY = d3.scaleLinear().range([0, waveHeight]).domain([0, 1]);
// 			var newClipArea;
// 			if (config.waveHeightScaling) {
// 				newClipArea = d3.area()
// 					.x(function(d) {
// 						return waveScaleX(d.x);
// 					})
// 					.y0(function(d) {
// 						return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
// 					})
// 					.y1(function(d) {
// 						return (fillCircleRadius * 2 + waveHeight);
// 					});
// 			} else {
// 				newClipArea = clipArea;
// 			}
//
// 			var newWavePosition = config.waveAnimate ? waveAnimateScale(1) : 0;
// 			wave.transition()
// 				.duration(0)
// 				.transition()
// 				.duration(config.waveAnimate ? (config.waveAnimateTime * (1 - wave.attr('T'))) : (config.waveRiseTime))
// 				.ease('linear')
// 				.attr('d', newClipArea)
// 				.attr('transform', 'translate(' + newWavePosition + ',0)')
// 				.attr('T', '1')
// 				.each("end", function() {
// 					if (config.waveAnimate) {
// 						wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
// 						animateWave(config.waveAnimateTime);
// 					}
// 				});
// 			waveGroup.transition()
// 				.duration(config.waveRiseTime)
// 				.attr('transform', 'translate(' + waveGroupXPosition + ',' + newHeight + ')')
// 		}
// 	}
//
// 	return new GaugeUpdater();
// }
