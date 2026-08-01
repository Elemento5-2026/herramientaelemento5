import supabase from "../lib/supabase";

export async function guardarEncabezado(formulario, investigacionId = null) {

    if (!investigacionId) {

        const { data, error } = await supabase

            .from("investigaciones")

            .insert({

                codigo_controlado: formulario.codigo_controlado,

                estado: "Borrador",

                participantes: formulario.participantes,

                elaborado_nombre: formulario.elaborado_nombre,
                elaborado_puesto: formulario.elaborado_puesto,
                elaborado_gerencia: formulario.elaborado_gerencia,
                elaborado_area: formulario.elaborado_area,
                elaborado_fecha: formulario.elaborado_fecha,

                revisado_nombre: formulario.revisado_nombre,
                revisado_puesto: formulario.revisado_puesto,
                revisado_gerencia: formulario.revisado_gerencia,
                revisado_area: formulario.revisado_area,
                revisado_fecha: formulario.revisado_fecha,

                aprobado_nombre: formulario.aprobado_nombre,
                aprobado_puesto: formulario.aprobado_puesto,
                aprobado_gerencia: formulario.aprobado_gerencia,
                aprobado_area: formulario.aprobado_area,
                aprobado_fecha: formulario.aprobado_fecha

            })

            .select()

            .single();

        if (error) throw error;

        return data;

    }

    const { data, error } = await supabase

        .from("investigaciones")

        .update({

            codigo_controlado: formulario.codigo_controlado,

            participantes: formulario.participantes,

            elaborado_nombre: formulario.elaborado_nombre,
            elaborado_puesto: formulario.elaborado_puesto,
            elaborado_gerencia: formulario.elaborado_gerencia,
            elaborado_area: formulario.elaborado_area,
            elaborado_fecha: formulario.elaborado_fecha,

            revisado_nombre: formulario.revisado_nombre,
            revisado_puesto: formulario.revisado_puesto,
            revisado_gerencia: formulario.revisado_gerencia,
            revisado_area: formulario.revisado_area,
            revisado_fecha: formulario.revisado_fecha,

            aprobado_nombre: formulario.aprobado_nombre,
            aprobado_puesto: formulario.aprobado_puesto,
            aprobado_gerencia: formulario.aprobado_gerencia,
            aprobado_area: formulario.aprobado_area,
            aprobado_fecha: formulario.aprobado_fecha,

            updated_at: new Date()

        })

        .eq("id", investigacionId)

        .select()

        .single();

    if (error) throw error;

    return data;

}
