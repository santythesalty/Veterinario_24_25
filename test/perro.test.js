const request = require("supertest");
const app = require("../index"); // Importa el servidor Express

describe("🐶 Pruebas sobre la API de Perros", () => {

  /*** 🔹 GET /api/perros - Obtener lista de perros ***/
  test("✅ GET /api/perros → Obtener lista de perros", async () => {
    const res = await request(app).get("/api/perros");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.datos)).toBe(true);
  });

  /*** 🔹 GET /api/perros/:nombre - Obtener un perro por nombre ***/
  test("✅ GET /api/perros/Max → Obtener un perro específico", async () => {
    const res = await request(app).get("/api/perros/Max");
    if (res.statusCode === 200) {
      expect(res.body.ok).toBe(true);
      expect(res.body.datos.nombre).toBe("Max");
    } else {
      expect(res.statusCode).toBe(404);
      expect(res.body.ok).toBe(false);
    }
  });

  test("❌ GET /api/perros/Inexistente → Perro no encontrado", async () => {
    const res = await request(app).get("/api/perros/Inexistente");
    expect(res.statusCode).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  /*** 🔹 POST /api/perros - Crear un nuevo perro ***/
  test("✅ POST /api/perros → Crear un perro exitosamente", async () => {
    const nuevoPerro = {
      nombre: "Maximun",
      raza: "Pastor Aleman",
      peso: 20,
      fecha_nacimiento: "2019-10-25",
      vacunado: 1,
      dueno_id: 1,
    };

    const res = await request(app).post("/api/perros").send(nuevoPerro);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.mensaje).toBe("Perro creado");
  });

  test("❌ POST /api/perros → Error al crear un perro sin datos", async () => {
    const res = await request(app).post("/api/perros").send({});
    expect(res.statusCode).toBe(500);
    expect(res.body.ok).toBe(false);
  });

  /*** 🔹 PUT /api/perros/:id - Actualizar un perro ***/
  test("✅ PUT /api/perros/9 → Actualizar un perro exitosamente", async () => {
    const perroActualizado = {
      id: 9,
      nombre: "morcilla" + Math.floor(Math.random() * 100),
      raza: "Pastor Aleman",
      peso: 20,
      fecha_nacimiento: "2019-10-25",
      vacunado: 1,
      id_dueno: 1,
    };

    const res = await request(app).put("/api/perros/9").send(perroActualizado);
    expect(res.statusCode).toBe(204);
  });

  test("❌ PUT /api/perros/999 → Intentar actualizar un perro inexistente", async () => {
    const perroInexistente = {
      id: 999,
      nombre: "Desconocido",
      raza: "Mestizo",
      peso: 10,
      fecha_nacimiento: "2020-01-01",
      vacunado: 0,
      id_dueno: 2,
    };

    const res = await request(app).put("/api/perros/999").send(perroInexistente);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "No encontrado o no modificado: 999");
  });

  /*** 🔹 DELETE /api/perros/:nombre - Eliminar un perro ***/
  test("✅ DELETE /api/perros/Maximun → Eliminar un perro existente", async () => {
    const res = await request(app).delete("/api/perros/Maximun");
    expect(res.statusCode).toBe(204);
  });

  test("❌ DELETE /api/perros/Inexistente → Intentar eliminar un perro no existente", async () => {
    const res = await request(app).delete("/api/perros/Inexistente");
    expect(res.statusCode).toBe(404);
    expect(res.body.ok).toBe(false);
  });

  /*** 🔹 GET /api/perros/grafica - Obtener datos para la gráfica ***/
  test("✅ GET /api/perros/grafica → Obtener datos de perros agrupados por raza", async () => {
    const res = await request(app).get("/api/perros/grafica");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(Array.isArray(res.body.datos)).toBe(true);
  });
});
