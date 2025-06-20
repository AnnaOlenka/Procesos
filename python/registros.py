import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from typing import Dict

class Producto:
    def __init__(self, nombre: str, precio: float, cantidad: int) -> None:
        self.nombre = nombre
        self.precio = precio
        self.stock = cantidad
        self.vendidos = 0

    def vender(self, cantidad: int) -> bool:
        if cantidad <= self.stock:
            self.stock -= cantidad
            self.vendidos += cantidad
            return True
        else:
            return False

class Tienda:
    def __init__(self, meta_ventas: int = 0) -> None:
        self.productos: Dict[str, Producto] = {}
        self.meta_ventas = meta_ventas

    def agregar_producto(self, nombre: str, precio: float, cantidad: int) -> bool:
        if nombre in self.productos:
            self.productos[nombre].stock += cantidad
            self.productos[nombre].precio = precio
        else:
            self.productos[nombre] = Producto(nombre, precio, cantidad)
        return True

    def vender_producto(self, nombre: str, cantidad: int) -> bool:
        if nombre not in self.productos:
            return False
        return self.productos[nombre].vender(cantidad)

    def total_vendidos(self) -> int:
        return sum(p.vendidos for p in self.productos.values())

    def meta_alcanzada(self) -> bool:
        if self.meta_ventas == 0:
            return False
        return self.total_vendidos() >= self.meta_ventas

class AplicacionTienda(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Gestión Simple de Tienda")
        self.geometry("750x600")
        self.resizable(False, False)

        self.tienda = None
        self.var_producto_vender = tk.StringVar()

        self.meta_ventas = self.pedir_meta_ventas()
        self.tienda = Tienda(self.meta_ventas)

        self.crear_interfaz()

    def pedir_meta_ventas(self) -> int:
        while True:
            meta = simpledialog.askstring("Meta de Ventas", "Establece una meta de ventas (unidades vendidas). Ingresa 0 si no hay meta:", parent=self)
            if meta is None:
                return 0
            if meta.isdigit():
                return int(meta)
            else:
                messagebox.showerror("Entrada Inválida", "Por favor ingresa un número entero no negativo válido.")

    def crear_interfaz(self):
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(expand=True, fill='both', padx=10, pady=10)

        self.tab_agregar = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_agregar, text="Agregar / Registrar Producto")
        self.crear_tab_agregar(self.tab_agregar)

        self.tab_vender = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_vender, text="Vender Producto")
        self.crear_tab_vender(self.tab_vender)

        self.tab_ver = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_ver, text="Ver Productos y Ventas")
        self.crear_tab_ver(self.tab_ver)

        self.tab_meta = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_meta, text="Estado de la Meta")
        self.crear_tab_meta(self.tab_meta)
        
        self.tab_ficha = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_ficha, text="Ficha del Indicador")
        self.crear_ficha_indicador(self.tab_ficha)

    def crear_ficha_indicador(self, parent):
        opciones_padding = {'padx': 8, 'pady': 8}
        ttk.Label(parent, text="Código del Indicador").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        ttk.Label(parent, text="Resultado Planificado").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        ttk.Label(parent, text="Indicador").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        ttk.Label(parent, text="Forma de cálculo").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        ttk.Label(parent, text="Fuente de Información").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        #Gráfico
        ttk.Label(parent, text="Seguimiento y Presentación").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_cod = ttk.Entry(parent, width=30)
        self.entry_cod.grid(row=0, column=1, **opciones_padding)
        
        

        
    def crear_tab_agregar(self, parent):
        opciones_padding = {'padx': 8, 'pady': 8}

        ttk.Label(parent, text="Nombre del Producto:").grid(row=0, column=0, sticky='w', **opciones_padding)
        self.entry_nombre = ttk.Entry(parent, width=30)
        self.entry_nombre.grid(row=0, column=1, **opciones_padding)

        ttk.Label(parent, text="Precio:").grid(row=1, column=0, sticky='w', **opciones_padding)
        self.entry_precio = ttk.Entry(parent, width=30)
        self.entry_precio.grid(row=1, column=1, **opciones_padding)

        ttk.Label(parent, text="Cantidad:").grid(row=2, column=0, sticky='w', **opciones_padding)
        self.entry_cantidad = ttk.Entry(parent, width=30)
        self.entry_cantidad.grid(row=2, column=1, **opciones_padding)

        btn_agregar = ttk.Button(parent, text="Agregar / Actualizar Producto", command=self.manejar_agregar_producto)
        btn_agregar.grid(row=3, column=0, columnspan=2, pady=15)

    def manejar_agregar_producto(self):
        nombre = self.entry_nombre.get().strip()
        precio_str = self.entry_precio.get().strip()
        cantidad_str = self.entry_cantidad.get().strip()

        if not nombre:
            messagebox.showerror("Error de Entrada", "El nombre del producto no puede estar vacío.")
            return

        try:
            precio = float(precio_str)
            cantidad = int(cantidad_str)
            if precio < 0 or cantidad < 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error de Entrada", "Por favor ingresa valores numéricos válidos y no negativos.")
            return

        self.tienda.agregar_producto(nombre, precio, cantidad)
        messagebox.showinfo("Éxito", f"Producto '{nombre}' agregado o actualizado correctamente.")
        self.entry_nombre.delete(0, tk.END)
        self.entry_precio.delete(0, tk.END)
        self.entry_cantidad.delete(0, tk.END)
        self.actualizar_opciones_vender()
        self.actualizar_tab_ver()
        self.actualizar_estado_meta()

    def crear_tab_vender(self, parent):
        opciones_padding = {'padx': 8, 'pady': 8}

        ttk.Label(parent, text="Selecciona Producto a Vender:").grid(row=0, column=0, columnspan=2, sticky='w', **opciones_padding)

        self.tree_vender = ttk.Treeview(parent, columns=("Nombre", "Precio", "Stock"), show="headings", height=6)
        self.tree_vender.grid(row=1, column=0, columnspan=2, **opciones_padding)

        for col in ("Nombre", "Precio", "Stock"):
            self.tree_vender.heading(col, text=col)
            self.tree_vender.column(col, anchor='center', width=100)

        self.tree_vender.bind("<<TreeviewSelect>>", self.on_select_producto_vender)

        ttk.Label(parent, text="Cantidad a Vender:").grid(row=2, column=0, sticky='w', **opciones_padding)
        self.entry_cantidad_vender = ttk.Entry(parent, width=30)
        self.entry_cantidad_vender.grid(row=2, column=1, **opciones_padding)

        btn_vender = ttk.Button(parent, text="Vender Producto", command=self.manejar_vender_producto)
        btn_vender.grid(row=3, column=0, columnspan=2, pady=15)

        self.actualizar_tabla_vender()

    def on_select_producto_vender(self, event):
        selected = self.tree_vender.selection()
        if selected:
            item = self.tree_vender.item(selected[0])
            self.var_producto_vender.set(item['values'][0])

    def manejar_vender_producto(self):
        nombre = self.var_producto_vender.get()
        cantidad_str = self.entry_cantidad_vender.get().strip()

        if not nombre:
            messagebox.showerror("Error de Entrada", "No se ha seleccionado ningún producto.")
            return

        try:
            cantidad = int(cantidad_str)
            if cantidad <= 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error de Entrada", "Ingresa un número entero positivo válido.")
            return

        exito = self.tienda.vender_producto(nombre, cantidad)
        if exito:
            messagebox.showinfo("Éxito", f"Se vendieron {cantidad} unidad(es) de '{nombre}'.")
            self.entry_cantidad_vender.delete(0, tk.END)
            self.actualizar_tab_ver()
            self.actualizar_tabla_vender()
            self.actualizar_estado_meta()
        else:
            stock = self.tienda.productos[nombre].stock if nombre in self.tienda.productos else 0
            messagebox.showerror("Error de Stock", f"Stock insuficiente para '{nombre}'. Stock actual: {stock}")

    def actualizar_tabla_vender(self):
        for item in self.tree_vender.get_children():
            self.tree_vender.delete(item)

        for nombre, p in self.tienda.productos.items():
            self.tree_vender.insert('', 'end', values=(nombre, f"${p.precio:.2f}", p.stock))

    def actualizar_opciones_vender(self):
        self.actualizar_tabla_vender()

    def crear_tab_ver(self, parent):
        marco = ttk.Frame(parent)
        marco.pack(expand=True, fill='both', padx=10, pady=10)

        # Tabla de productos
        ttk.Label(marco, text="Productos Disponibles:", font=("Arial", 10, "bold")).pack(anchor='w')
        columnas_productos = ("Nombre", "Precio", "Stock")
        self.tree_productos = ttk.Treeview(marco, columns=columnas_productos, show='headings', height=6)
        for col in columnas_productos:
            self.tree_productos.heading(col, text=col)
            self.tree_productos.column(col, anchor='center', width=100)
        self.tree_productos.pack(fill='x', pady=5)

        # Tabla de ventas
        ttk.Label(marco, text="Resumen de Ventas:", font=("Arial", 10, "bold")).pack(anchor='w', pady=(10, 0))
        columnas_ventas = ("Nombre", "Vendidos")
        self.tree_ventas = ttk.Treeview(marco, columns=columnas_ventas, show='headings', height=6)
        for col in columnas_ventas:
            self.tree_ventas.heading(col, text=col)
            self.tree_ventas.column(col, anchor='center', width=150)
        self.tree_ventas.pack(fill='x')

        self.label_resumen = ttk.Label(marco, text="", anchor='center', font=('Arial', 12, 'bold'))
        self.label_resumen.pack(pady=10)

        self.actualizar_tab_ver()

    def actualizar_tab_ver(self):
        # Actualizar productos
        for item in self.tree_productos.get_children():
            self.tree_productos.delete(item)
        for nombre, p in self.tienda.productos.items():
            self.tree_productos.insert('', 'end', values=(nombre, f"${p.precio:.2f}", p.stock))

        # Actualizar ventas
        for item in self.tree_ventas.get_children():
            self.tree_ventas.delete(item)
        for nombre, p in self.tienda.productos.items():
            if p.vendidos > 0:
                self.tree_ventas.insert('', 'end', values=(nombre, p.vendidos))

        # Actualizar resumen
        total = self.tienda.total_vendidos()
        meta = self.tienda.meta_ventas
        if meta > 0:
            if self.tienda.meta_alcanzada():
                estado = f"¡Felicidades! Meta de {meta} unidades vendidas alcanzada."
            else:
                estado = f"Meta no alcanzada. Faltan {meta - total} unidades."
        else:
            estado = "No se ha establecido una meta de ventas."

        resumen = f"Meta de Ventas: {meta} unidades\nTotal de Productos Vendidos: {total}\n{estado}"
        self.label_resumen.config(text=resumen)

    def crear_tab_meta(self, parent):
        marco = ttk.Frame(parent)
        marco.pack(expand=True, fill='both', padx=10, pady=10)

        self.label_estado_meta = ttk.Label(
            marco,
            text="",
            anchor='center',
            font=('Arial', 16, 'bold'),
            foreground='blue'
        )
        self.label_estado_meta.pack(expand=True)

        btn_actualizar = ttk.Button(marco, text="Actualizar Meta", command=self.pedir_nueva_meta)
        btn_actualizar.pack(pady=20)

        self.actualizar_estado_meta()

    def pedir_nueva_meta(self):
        nueva_meta = simpledialog.askstring("Actualizar Meta", "Ingresa una nueva meta de ventas:", parent=self)
        if nueva_meta is not None:
            if nueva_meta.isdigit():
                self.tienda.meta_ventas = int(nueva_meta)
                self.actualizar_estado_meta()
            else:
                messagebox.showerror("Error", "La meta debe ser un número entero válido.")

    def actualizar_estado_meta(self):
        total = self.tienda.total_vendidos()
        meta = self.tienda.meta_ventas

        if meta > 0:
            if self.tienda.meta_alcanzada():
                texto = f"🎉 ¡Meta alcanzada! Se han vendido {total} unidades."
                color = 'green'
            else:
                faltan = meta - total
                texto = f"⏳ Meta no alcanzada. Faltan {faltan} unidades para cumplir la meta."
                color = 'red'
        else:
            texto = "ℹ️ No se ha establecido una meta de ventas."
            color = 'blue'

        self.label_estado_meta.config(text=texto, foreground=color)
        self.actualizar_tab_ver()

if __name__ == "__main__":
    app = AplicacionTienda()
    app.mainloop()
