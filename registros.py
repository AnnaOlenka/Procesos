import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from typing import Dict

class Producto:
    def _init_(self, nombre: str, precio: float, cantidad: int) -> None:
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
    def _init_(self, meta_ventas: int = 0) -> None:
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
    def _init_(self):
        super()._init_()
        self.title("Gestión Simple de Tienda")
        self.geometry("700x500")
        self.resizable(False, False)

        self.tienda = None
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

    def crear_tab_vender(self, parent):
        opciones_padding = {'padx': 8, 'pady': 8}

        ttk.Label(parent, text="Selecciona Producto a Vender:").grid(row=0, column=0, sticky='w', **opciones_padding)

        self.var_producto_vender = tk.StringVar()
        self.combo_productos = ttk.Combobox(parent, textvariable=self.var_producto_vender, state='readonly')
        self.combo_productos.grid(row=0, column=1, **opciones_padding)
        self.actualizar_opciones_vender()

        ttk.Label(parent, text="Cantidad a Vender:").grid(row=1, column=0, sticky='w', **opciones_padding)
        self.entry_cantidad_vender = ttk.Entry(parent, width=30)
        self.entry_cantidad_vender.grid(row=1, column=1, **opciones_padding)

        btn_vender = ttk.Button(parent, text="Vender Producto", command=self.manejar_vender_producto)
        btn_vender.grid(row=2, column=0, columnspan=2, pady=15)

    def actualizar_opciones_vender(self):
        nombres = list(self.tienda.productos.keys())
        self.combo_productos['values'] = nombres
        if nombres:
            self.combo_productos.current(0)
        else:
            self.combo_productos.set('')

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
        else:
            stock = self.tienda.productos[nombre].stock if nombre in self.tienda.productos else 0
            messagebox.showerror("Error de Stock", f"Stock insuficiente para '{nombre}'. Stock actual: {stock}")

    def crear_tab_ver(self, parent):
        marco = ttk.Frame(parent)
        marco.pack(expand=True, fill='both', padx=10, pady=10)

        columnas = ("Precio", "Stock", "Vendidos")
        self.tree = ttk.Treeview(marco, columns=columnas, show='headings', height=15)
        for col in columnas:
            self.tree.heading(col, text=col)
            self.tree.column(col, anchor='center', width=100)
        self.tree.pack(side='top', fill='both', expand=True)

        self.label_resumen = ttk.Label(marco, text="", anchor='center', font=('Arial', 12, 'bold'))
        self.label_resumen.pack(side='bottom', pady=10)

        self.actualizar_tab_ver()

    def actualizar_tab_ver(self):
        for item in self.tree.get_children():
            self.tree.delete(item)

        for p in self.tienda.productos.values():
            self.tree.insert('', 'end', values=(f"${p.precio:.2f}", p.stock, p.vendidos))

        total = self.tienda.total_vendidos()
        if self.tienda.meta_ventas > 0:
            if self.tienda.meta_alcanzada():
                estado = f"¡Felicidades! Meta de {self.tienda.meta_ventas} unidades vendidas alcanzada."
            else:
                faltan = self.tienda.meta_ventas - total
                estado = f"Meta no alcanzada. Faltan {faltan} unidades por vender."
        else:
            estado = "No se ha establecido una meta de ventas."

        resumen = f"Total de Productos Vendidos: {total}\n{estado}"
        self.label_resumen.config(text=resumen)

if __name__ == "_main_":
    app = AplicacionTienda()
    app.mainloop()