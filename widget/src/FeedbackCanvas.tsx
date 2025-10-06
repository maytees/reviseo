import {
	type ActiveSelection,
	Canvas,
	Circle as FabricCircle,
	type FabricObject,
	Line,
	Rect,
	Textbox,
	type TPointerEvent,
	type TPointerEventInfo,
} from "fabric";
import {
	ArrowUpRight,
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
const BACKGROUND_COLOR = "#FBFCF8";

const FeedbackCanvas = ({
	canvasRef,
}: {
	canvasRef: RefObject<HTMLCanvasElement | null>;
}) => {
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
				selection: activeTool === "select",
			});
			initCanvas.backgroundColor = BACKGROUND_COLOR;
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

	// Handle tool switching
	useEffect(() => {
		if (!canvas) return;

		// Enable/disable selection based on active tool
		canvas.selection = activeTool === "select";

		// Make objects selectable only in select mode, but keep evented for editing text
		canvas.forEachObject((obj) => {
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
				fill: selectedColor,
				stroke: "#000",
				strokeUniform: true,
				strokeWidth: 2,
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
	}, [canvas, activeTool, isDrawing, currentShape, startPoint, selectedColor]);

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
				fill: selectedColor,
				stroke: "#000",
				strokeUniform: true,
				strokeWidth: 3,
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
	}, [canvas, activeTool, isDrawing, currentShape, startPoint, selectedColor]);

	// Arrow drawing handlers
	useEffect(() => {
		if (!canvas || activeTool !== "arrow") return;

		const handleMouseDown = (e: TPointerEventInfo<TPointerEvent>) => {
			const pointer = canvas.getPointer(e.e);
			setIsDrawing(true);
			setStartPoint({ x: pointer.x, y: pointer.y });

			const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
				stroke: selectedColor,
				strokeWidth: 3,
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
	}, [canvas, activeTool, isDrawing, currentShape, startPoint, selectedColor]);

	// Text tool handler
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
			canvas.renderAll();

			// Switch to select mode AFTER adding the textbox
			setActiveTool("select");

			// Wait for next frame to safely enter editing mode
			requestAnimationFrame(() => {
				textbox.enterEditing();
				textbox.selectAll();
				canvas.renderAll();
			});

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
			// For rectangles and circles, change the fill
			obj.set({ fill: color });
		}
	};

	return (
		<div className="h-full w-full">
			<div className="absolute top-1/4 left-5 h-5 w-5 z-99999">
				<ButtonGroup orientation={"vertical"}>
					<ButtonGroup>
						<ColorSwatch
							onColorChange={handleColorChange}
							selectedColor={selectedColor}
						/>
					</ButtonGroup>
					<ButtonGroup orientation={"vertical"}>
						<Button
							tooltip="Select"
							mode={"icon"}
							variant={activeTool === "select" ? "mono" : "outline"}
							onClick={() => setActiveTool("select")}
						>
							<PointerIcon />
						</Button>
						<Button
							tooltip="arrow"
							mode={"icon"}
							variant={activeTool === "arrow" ? "mono" : "outline"}
							onClick={() => setActiveTool("arrow")}
						>
							<ArrowUpRight />
						</Button>
						<Button
							tooltip="Text"
							mode={"icon"}
							variant={activeTool === "text" ? "mono" : "outline"}
							onClick={() => setActiveTool("text")}
						>
							<Type />
						</Button>
						<Button
							onClick={() => setActiveTool("rectangle")}
							tooltip="Rectangle"
							mode={"icon"}
							variant={activeTool === "rectangle" ? "mono" : "outline"}
						>
							<Square />
						</Button>
						<Button
							tooltip="Circle"
							mode={"icon"}
							variant={activeTool === "circle" ? "mono" : "outline"}
							onClick={() => setActiveTool("circle")}
						>
							<Circle />
						</Button>
						<Button
							tooltip="Draw"
							mode={"icon"}
							variant={activeTool === "draw" ? "mono" : "outline"}
							onClick={() => setActiveTool("draw")}
						>
							<Pencil />
						</Button>
						<Button
							tooltip="Add Image"
							mode={"icon"}
							variant={activeTool === "image" ? "mono" : "outline"}
							onClick={() => setActiveTool("image")}
						>
							<ImagePlus />
						</Button>
					</ButtonGroup>
					<ButtonGroup orientation={"vertical"}>
						<Button tooltip="Undo" mode={"icon"} variant={"outline"}>
							<Undo />
						</Button>
						<Button tooltip="Redo" mode={"icon"} variant={"outline"}>
							<Redo />
						</Button>
					</ButtonGroup>
					<ButtonGroup orientation={"vertical"}>
						<Button
							tooltip="Delete"
							mode={"icon"}
							variant={"destructive"}
							onClick={handleDelete}
							disabled={!hasSelection}
						>
							<Trash2 />
						</Button>
					</ButtonGroup>
				</ButtonGroup>
			</div>
			<canvas ref={canvasRef} className="block rounded-2xl h-full w-full" />
		</div>
	);
};

export default FeedbackCanvas;
