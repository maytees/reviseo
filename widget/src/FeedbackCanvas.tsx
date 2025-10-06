import {
	type ActiveSelection,
	Canvas,
	Circle as FabricCircle,
	FabricImage,
	type FabricObject,
	Line,
	PencilBrush,
	Rect,
	Textbox,
	type TPointerEvent,
	type TPointerEventInfo,
} from "fabric";
import {
	ArrowUpRight,
	Blend,
	Circle,
	ImagePlus,
	Pencil,
	PointerIcon,
	Redo,
	Square,
	Trash2,
	Type,
	Undo,
} from "lucide-react";
import { type RefObject, useEffect, useState } from "react";
import ColorSwatch from "./components/ColorSwatch";
import StrokeWidthSwatch from "./components/StrokeWidthSwatch";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";

type Tool =
	| "select"
	| "rectangle"
	| "circle"
	| "text"
	| "draw"
	| "image"
	| "arrow";
const BACKGROUND_COLOR = "#fff";

const FeedbackCanvas = ({
	canvasRef,
	thingId,
	screenshotData,
	onCanvasElementIds,
	isLoading,
}: {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	thingId: string;
	screenshotData: string | null;
	onCanvasElementIds?: (ids: string[]) => void;
	isLoading: boolean;
}) => {
	// Generate unique IDs for all canvas elements
	const toolbarId = `${thingId}-toolbar`;
	const canvasElementId = `${thingId}-canvas`;

	// Report canvas element IDs to parent
	useEffect(() => {
		if (onCanvasElementIds) {
			onCanvasElementIds([thingId, toolbarId, canvasElementId]);
		}
	}, [thingId, toolbarId, canvasElementId, onCanvasElementIds]);
	const [canvas, setCanvas] = useState<Canvas | null>(null);
	const [activeTool, setActiveTool] = useState<Tool>("select");
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentShape, setCurrentShape] = useState<
		Rect | FabricCircle | Line | Textbox | null
	>(null);
	const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
		null,
	);
	const [hasSelection, setHasSelection] = useState(false);
	const [selectedColor, setSelectedColor] = useState("#000000");
	const [selectedStrokeWidth, setSelectedStrokeWidth] = useState(5);
	const [isFillTransparent, setIsFillTransparent] = useState(false);

	useEffect(() => {
		if (!canvas) return;

		const updateSelectionColor = () => {
			const activeObject = canvas.getActiveObject();
			if (activeObject) {
				let color = "#000000";

				// Handle multiple selections (ActiveSelection)
				if (activeObject.type === "activeSelection") {
					const objects = (activeObject as ActiveSelection).getObjects();
					if (objects.length > 0) {
						// Use the color of the first object in the selection
						color = getObjectColor(objects[0]);
					}
				} else {
					// Handle single selection
					color = getObjectColor(activeObject);
				}
				setSelectedColor(color);
			}
		};

		const getObjectColor = (obj: FabricObject): string => {
			if (obj.type === "line") {
				return obj.stroke?.toString() || "#000000";
			} else if (obj.type === "textbox" || obj.type === "i-text") {
				return obj.fill?.toString() || "#000000";
			} else {
				// For rectangles and circles, prefer fill over stroke
				return obj.fill?.toString() || obj.stroke?.toString() || "#000000";
			}
		};

		canvas.on("selection:created", updateSelectionColor);
		canvas.on("selection:updated", updateSelectionColor);
		canvas.on("selection:cleared", () => {
			// Keep the current selectedColor when nothing is selected
		});
	}, [canvas]);

	useEffect(() => {
		if (canvasRef?.current) {
			const parent = canvasRef.current.parentElement;
			if (!parent) return;
			const width = parent.clientWidth;
			const height = parent.clientHeight;

			const initCanvas = new Canvas(canvasRef.current, {
				width: width,
				height: height,
				uniformScaling: false,
				selection: true,
			});
			initCanvas.backgroundColor = BACKGROUND_COLOR;
			// Ensure keyboard focus is possible for text editing
			// and initialize a drawing brush for free drawing
			(initCanvas.upperCanvasEl as HTMLCanvasElement).tabIndex = 1000;
			initCanvas.freeDrawingBrush = new PencilBrush(initCanvas);
			initCanvas.renderAll();
			setCanvas(initCanvas);

			const handleResize = () => {
				const newWidth = parent.clientWidth;
				const newHeight = parent.clientHeight;
				initCanvas.setDimensions({
					width: newWidth,
					height: newHeight,
				});
				initCanvas.renderAll();
			};

			window.addEventListener("resize", handleResize);
			return () => {
				window.removeEventListener("resize", handleResize);
				initCanvas.dispose();
			};
		}
	}, [canvasRef]);

	// Handle tool switching - only when tool changes
	useEffect(() => {
		if (!canvas) return;

		// Enable/disable selection based on active tool
		canvas.selection = activeTool === "select";

		// Enable/disable drawing mode
		canvas.isDrawingMode = activeTool === "draw";

		// Make objects selectable only in select mode, but keep evented for editing text
		canvas.forEachObject((obj) => {
			// Skip background image - it should never be selectable
			if ((obj as any).name === "background-screenshot") {
				obj.selectable = false;
				obj.evented = false;
				return;
			}

			if (obj.type === "textbox") {
				// Textboxes should always be evented and editable
				(obj as Textbox).selectable = true;
				(obj as Textbox).evented = true;
				(obj as Textbox).editable = true;
			} else {
				obj.selectable = activeTool === "select";
				obj.evented = activeTool === "select";
			}
		});

		canvas.renderAll();
	}, [activeTool, canvas]);

	// Configure drawing brush - separate effect for color/width changes
	useEffect(() => {
		if (!canvas || activeTool !== "draw") return;

		if (canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.color = selectedColor;
			canvas.freeDrawingBrush.width = selectedStrokeWidth;
		}
	}, [canvas, activeTool, selectedColor, selectedStrokeWidth]);

	// Handle screenshot background image
	useEffect(() => {
		if (!canvas || !screenshotData) return;

		const loadBackgroundImage = async () => {
			try {
				const img = await FabricImage.fromURL(screenshotData, {
					crossOrigin: "anonymous",
				});

				// Scale and center the image to fit the canvas viewport
				const canvasWidth = canvas.getWidth();
				const canvasHeight = canvas.getHeight();
				const imgWidth = img.width || 1;
				const imgHeight = img.height || 1;

				const scaleX = canvasWidth / imgWidth;
				const scaleY = canvasHeight / imgHeight;
				const scale = Math.min(scaleX, scaleY);

				// Calculate scaled dimensions
				const scaledWidth = imgWidth * scale;
				const scaledHeight = imgHeight * scale;

				// Center the image in the canvas
				const left = (canvasWidth - scaledWidth) / 2;
				const top = (canvasHeight - scaledHeight) / 2;

				img.set({
					scaleX: scale,
					scaleY: scale,
					left: left,
					top: top,
					selectable: false,
					evented: false,
					excludeFromExport: false,
					lockMovementX: true,
					lockMovementY: true,
					lockRotation: true,
					lockScalingX: true,
					lockScalingY: true,
					lockUniScaling: true,
					hasControls: false,
					hasBorders: false,
					hoverCursor: "default",
					moveCursor: "default",
				});

				// Clear any existing background image
				const existingObjects = canvas.getObjects();
				const backgroundImages = existingObjects.filter(
					(obj) => (obj as any).name === "background-screenshot",
				);
				for (const obj of backgroundImages) {
					canvas.remove(obj);
				}

				// Add the image as the first object (background)
				(img as any).name = "background-screenshot";
				canvas.add(img);
				canvas.sendObjectToBack(img); // Ensure it stays at the bottom
				canvas.renderAll();
			} catch (error) {
				console.error("Failed to load background image:", error);
			}
		};

		loadBackgroundImage();
	}, [canvas, screenshotData]);

	// Track selection changes
	useEffect(() => {
		if (!canvas) return;

		const handleSelectionCreated = () => setHasSelection(true);
		const handleSelectionUpdated = () => setHasSelection(true);
		const handleSelectionCleared = () => setHasSelection(false);

		canvas.on("selection:created", handleSelectionCreated);
		canvas.on("selection:updated", handleSelectionUpdated);
		canvas.on("selection:cleared", handleSelectionCleared);

		return () => {
			canvas.off("selection:created", handleSelectionCreated);
			canvas.off("selection:updated", handleSelectionUpdated);
			canvas.off("selection:cleared", handleSelectionCleared);
		};
	}, [canvas]);

	// Rectangle drawing handlers
	useEffect(() => {
		if (!canvas || activeTool !== "rectangle") return;

		const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
			const pointer = canvas.getPointer(e.e);
			setIsDrawing(true);
			setStartPoint({ x: pointer.x, y: pointer.y });

			const rect = new Rect({
				left: pointer.x,
				top: pointer.y,
				width: 0,
				height: 0,
				fill: isFillTransparent ? "transparent" : selectedColor,
				stroke: "#000",
				strokeUniform: true,
				strokeWidth: selectedStrokeWidth,
				rx: 5,
				ry: 5,
				selectable: false,
				evented: false,
			});

			canvas.add(rect);
			setCurrentShape(rect);
		};

		const handleMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
			if (!isDrawing || !currentShape || !startPoint) return;

			const pointer = canvas.getPointer(e.e);

			// Calculate dimensions
			const width = pointer.x - startPoint.x;
			const height = pointer.y - startPoint.y;

			// Update rectangle position and size based on drag direction
			if (width > 0) {
				currentShape.set({ left: startPoint.x, width: Math.abs(width) });
			} else {
				currentShape.set({ left: pointer.x, width: Math.abs(width) });
			}

			if (height > 0) {
				currentShape.set({ top: startPoint.y, height: Math.abs(height) });
			} else {
				currentShape.set({ top: pointer.y, height: Math.abs(height) });
			}

			canvas.renderAll();
		};

		const handleMouseUp = () => {
			if (!currentShape) return;

			if (currentShape.width === 0 || currentShape.height === 0) {
				currentShape.set({ width: 100, height: 60 });
			}

			currentShape.set({
				selectable: true,
				evented: true,
			});

			// Select the newly created object
			canvas.setActiveObject(currentShape);
			canvas.renderAll();

			setIsDrawing(false);
			setCurrentShape(null);
			setStartPoint(null);

			// Switch to select tool after creating the rectangle
			setActiveTool("select");
		};

		canvas.on("mouse:down", handleMouseDown);
		canvas.on("mouse:move", handleMouseMove);
		canvas.on("mouse:up", handleMouseUp);

		return () => {
			canvas.off("mouse:down", handleMouseDown);
			canvas.off("mouse:move", handleMouseMove);
			canvas.off("mouse:up", handleMouseUp);
		};
	}, [
		canvas,
		activeTool,
		isDrawing,
		currentShape,
		startPoint,
		selectedColor,
		selectedStrokeWidth,
		isFillTransparent,
	]);

	// Circle drawing handlers
	useEffect(() => {
		if (!canvas || activeTool !== "circle") return;

		const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
			const pointer = canvas.getPointer(e.e);
			setIsDrawing(true);
			setStartPoint({ x: pointer.x, y: pointer.y });

			const circle = new FabricCircle({
				left: pointer.x,
				top: pointer.y,
				radius: 0,
				fill: isFillTransparent ? "transparent" : selectedColor,
				stroke: "#000",
				strokeUniform: false,
				strokeWidth: selectedStrokeWidth,
				selectable: false,
				evented: false,
			});

			canvas.add(circle);
			setCurrentShape(circle);
		};

		const handleMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
			if (!isDrawing || !currentShape || !startPoint) return;

			const pointer = canvas.getPointer(e.e);

			// Calculate radius based on distance from start point
			const dx = pointer.x - startPoint.x;
			const dy = pointer.y - startPoint.y;
			const radius = Math.sqrt(dx * dx + dy * dy);

			currentShape.set({ radius });
			canvas.renderAll();
		};

		const handleMouseUp = () => {
			if (!currentShape) return;

			if ((currentShape as FabricCircle).radius === 0) {
				currentShape.set({ radius: 50 });
			}

			currentShape.set({
				selectable: true,
				evented: true,
			});

			// Select the newly created object
			canvas.setActiveObject(currentShape);
			canvas.renderAll();

			setIsDrawing(false);
			setCurrentShape(null);
			setStartPoint(null);

			// Switch to select tool after creating the circle
			setActiveTool("select");
		};

		canvas.on("mouse:down", handleMouseDown);
		canvas.on("mouse:move", handleMouseMove);
		canvas.on("mouse:up", handleMouseUp);

		return () => {
			canvas.off("mouse:down", handleMouseDown);
			canvas.off("mouse:move", handleMouseMove);
			canvas.off("mouse:up", handleMouseUp);
		};
	}, [
		canvas,
		activeTool,
		isDrawing,
		currentShape,
		startPoint,
		selectedColor,
		selectedStrokeWidth,
		isFillTransparent,
	]);

	// Arrow drawing handlers
	useEffect(() => {
		if (!canvas || activeTool !== "arrow") return;

		const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
			const pointer = canvas.getPointer(e.e);
			setIsDrawing(true);
			setStartPoint({ x: pointer.x, y: pointer.y });

			const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
				stroke: selectedColor,
				strokeWidth: selectedStrokeWidth,
				strokeUniform: true,
				selectable: false,
				evented: false,
			});

			canvas.add(line);
			setCurrentShape(line);
		};

		const handleMouseMove = (e: TPointerEventInfo<TPointerEvent>) => {
			if (!isDrawing || !currentShape || !startPoint) return;

			const pointer = canvas.getPointer(e.e);
			currentShape.set({ x2: pointer.x, y2: pointer.y });
			canvas.renderAll();
		};

		const handleMouseUp = () => {
			if (!currentShape) return;

			currentShape.set({
				selectable: true,
				evented: true,
			});

			// Select the newly created object
			canvas.setActiveObject(currentShape);
			canvas.renderAll();

			setIsDrawing(false);
			setCurrentShape(null);
			setStartPoint(null);

			// Switch to select tool after creating the arrow
			setActiveTool("select");
		};

		canvas.on("mouse:down", handleMouseDown);
		canvas.on("mouse:move", handleMouseMove);
		canvas.on("mouse:up", handleMouseUp);

		return () => {
			canvas.off("mouse:down", handleMouseDown);
			canvas.off("mouse:move", handleMouseMove);
			canvas.off("mouse:up", handleMouseUp);
		};
	}, [
		canvas,
		activeTool,
		isDrawing,
		currentShape,
		startPoint,
		selectedColor,
		selectedStrokeWidth,
	]);

	// Text tool handler
	useEffect(() => {
		if (!canvas || activeTool !== "text") return;

		const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
			const pointer = canvas.getPointer(e.e);

			const textbox = new Textbox("Type here...", {
				left: pointer.x,
				top: pointer.y,
				width: 200,
				fontSize: 20,
				fill: selectedColor,
				selectable: true,
				evented: true,
				editable: true,
			});

			canvas.add(textbox);
			canvas.setActiveObject(textbox);

			// Switch to select mode AFTER adding the textbox
			setActiveTool("select");

			// Enter editing mode immediately
			textbox.enterEditing();
			textbox.selectAll();
			canvas.renderAll();

			textbox.on("editing:exited", () => {
				if (
					!textbox.text ||
					textbox.text.trim() === "" ||
					textbox.text.trim() === "Type here..."
				) {
					canvas.remove(textbox);
					canvas.renderAll();
				}
			});
		};

		canvas.on("mouse:down", handleMouseDown);

		return () => {
			canvas.off("mouse:down", handleMouseDown);
		};
	}, [canvas, activeTool, selectedColor]);

	const handleDelete = () => {
		if (!canvas) return;
		const activeObjects = canvas.getActiveObjects();
		for (const activeObject of activeObjects) {
			if (activeObject) {
				// Handle multiple selections (ActiveSelection)
				if (activeObject.type === "activeSelection") {
					const objects = (activeObject as ActiveSelection).getObjects();
					// Remove all selected objects
					objects.forEach((obj: FabricObject) => {
						canvas.remove(obj);
					});
				} else {
					// Handle single selection
					canvas.remove(activeObject);
				}
				canvas.discardActiveObject(); // Clear selection
				canvas.renderAll();
			}
		}
	};

	const handleColorChange = (color: string) => {
		setSelectedColor(color);

		// Apply color to currently selected object(s) if there are any
		if (!canvas) return;
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			// Handle multiple selections (ActiveSelection)
			if (activeObject.type === "activeSelection") {
				const objects = (activeObject as ActiveSelection).getObjects();
				objects.forEach((obj: FabricObject) => {
					applyColorToObject(obj, color);
				});
			} else {
				// Handle single selection
				applyColorToObject(activeObject, color);
			}
			canvas.renderAll();
		}
	};

	const applyColorToObject = (obj: FabricObject, color: string) => {
		// Apply color based on object type
		if (obj.type === "line") {
			obj.set({ stroke: color });
		} else if (obj.type === "textbox" || obj.type === "i-text") {
			obj.set({ fill: color });
		} else {
			// For rectangles and circles, change stroke if fill is transparent, otherwise fill
			const currentFill = (obj as any).fill?.toString?.() ?? (obj as any).fill;
			if (currentFill === "transparent") {
				obj.set({ stroke: color });
			} else {
				obj.set({ fill: color });
			}
		}
	};

	const handleStrokeWidthChange = (width: number) => {
		setSelectedStrokeWidth(width);

		// Update drawing brush if in drawing mode
		if (canvas && activeTool === "draw" && canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.width = width;
		}
	};

	return (
		<div className="h-full w-full relative" id={thingId}>
			<canvas
				ref={canvasRef}
				className="block rounded-2xl h-full w-full"
				id={canvasElementId}
			/>
			<div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[99999]" id={toolbarId}>
				{!isLoading && (
					<ButtonGroup orientation={"horizontal"}>
						<ButtonGroup orientation={"horizontal"}>
							<ColorSwatch
								onColorChange={handleColorChange}
								selectedColor={selectedColor}
							/>
							<StrokeWidthSwatch
								onStrokeWidthChange={handleStrokeWidthChange}
								selectedStrokeWidth={selectedStrokeWidth}
							/>
							{(() => {
								const isPlacingRectOrCircle =
									activeTool === "rectangle" || activeTool === "circle";
								let selectionSupports = false;
								if (hasSelection && canvas) {
									const objs = canvas.getActiveObjects();
									selectionSupports =
										objs.length > 0 &&
										objs.every(
											(o) => o.type === "rect" || o.type === "circle",
										);
								}
								const showTransparentToggle = isPlacingRectOrCircle || selectionSupports;
								return showTransparentToggle ? (
									<Button
										mode={"icon"}
										variant={isFillTransparent ? "dashed" : "outline"}
										onClick={() => {
											const next = !isFillTransparent;
											setIsFillTransparent(next);
											if (canvas && hasSelection) {
												const objs = canvas.getActiveObjects();
												for (const obj of objs) {
													if (obj.type === "rect" || obj.type === "circle") {
														if (next) {
															obj.set({ fill: "transparent", stroke: selectedColor });
														} else {
															obj.set({ fill: selectedColor });
														}
													}
												}
												canvas.renderAll();
											}
										}}
									>
										{isFillTransparent ? <Blend /> : <Circle />}
									</Button>
								) : null;
							})()}
						</ButtonGroup>
						<ButtonGroup orientation={"horizontal"}>
							<Button
								mode={"icon"}
								variant={activeTool === "select" ? "mono" : "outline"}
								onClick={() => setActiveTool("select")}
							>
								<PointerIcon />
							</Button>
							<Button
								mode={"icon"}
								variant={activeTool === "arrow" ? "mono" : "outline"}
								onClick={() => setActiveTool("arrow")}
							>
								<ArrowUpRight />
							</Button>
							<Button
								mode={"icon"}
								variant={activeTool === "text" ? "mono" : "outline"}
								onClick={() => setActiveTool("text")}
							>
								<Type />
							</Button>
							<Button
								onClick={() => setActiveTool("rectangle")}
								mode={"icon"}
								variant={activeTool === "rectangle" ? "mono" : "outline"}
							>
								<Square />
							</Button>
							<Button
								mode={"icon"}
								variant={activeTool === "circle" ? "mono" : "outline"}
								onClick={() => setActiveTool("circle")}
							>
								<Circle />
							</Button>
							<Button
								mode={"icon"}
								variant={activeTool === "draw" ? "mono" : "outline"}
								onClick={() => setActiveTool("draw")}
							>
								<Pencil />
							</Button>
							<Button
								mode={"icon"}
								variant={activeTool === "image" ? "mono" : "outline"}
								onClick={() => setActiveTool("image")}
							>
								<ImagePlus />
							</Button>
						</ButtonGroup>
						<ButtonGroup orientation={"horizontal"}>
							<Button mode={"icon"} variant={"outline"}>
								<Undo />
							</Button>
							<Button mode={"icon"} variant={"outline"}>
								<Redo />
							</Button>
						</ButtonGroup>
						<ButtonGroup orientation={"horizontal"}>
							<Button
								mode={"icon"}
								variant={"destructive"}
								onClick={handleDelete}
								disabled={!hasSelection}
							>
								<Trash2 />
							</Button>
						</ButtonGroup>
					</ButtonGroup>
				)}
			</div>
		</div>
	);
};

export default FeedbackCanvas;
