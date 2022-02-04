CREATE OR REPLACE VIEW public.vw_ws_caratteristiche_particella_plus
 AS
 SELECT concat(caratteristiche_particella.codice_comune, '-', caratteristiche_particella.id_particella, '-', caratteristiche_particella.progressivo) AS id_par_prog,
    caratteristiche_particella.id,
    caratteristiche_particella.id_particella,
    caratteristiche_particella.progressivo,
    caratteristiche_particella.codice_comune,
    caratteristiche_particella.edificialita,
    caratteristiche_particella.classe,
    caratteristiche_particella.ettari,
    caratteristiche_particella.are,
    caratteristiche_particella.centiare,
    caratteristiche_particella.flag_reddito,
    caratteristiche_particella.flag_porzione,
    caratteristiche_particella.flag_deduzioni,
    caratteristiche_particella.reddito_dominicale,
    caratteristiche_particella.reddito_agrario,
    caratteristiche_particella.reddito_dominicale_euro,
    caratteristiche_particella.reddito_agrario_euro,
    caratteristiche_particella.partita,
    caratteristiche_particella.annotazione,
    caratteristiche_particella.id_mutazionale_iniziale,
    caratteristiche_particella.id_mutazionale_finale,
    caratteristiche_particella.task_id,
    caratteristiche_particella.qualita,
    caratteristiche_particella.sezione
   FROM caratteristiche_particella;

ALTER TABLE public.vw_ws_caratteristiche_particella_plus
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_ws_particella_up_e_info_caratt_particella
 AS
 SELECT vw_ws_particella_up.id_par_prog AS pa_id_par_prog,
    vw_ws_particella_up.id AS pa_id,
    vw_ws_particella_up.id_particella AS pa_id_particella,
    vw_ws_particella_up.progressivo AS pa_progressivo,
    vw_ws_particella_up.codice_comune AS pa_codice_comune,
    vw_ws_particella_up.foglio AS pa_foglio,
    vw_ws_particella_up.numero AS pa_numero,
    vw_ws_particella_up.denominatore AS pa_denominatore,
    vw_ws_particella_up.subalterno AS pa_subalterno,
    vw_ws_particella_up.task_id AS pa_task_id,
    vw_ws_particella_up.sezione AS pa_sezione,
    vw_ws_caratteristiche_particella_plus.id_par_prog AS cp_id_par_prog,
    vw_ws_caratteristiche_particella_plus.id AS cp_id,
    vw_ws_caratteristiche_particella_plus.id_particella AS cp_id_particella,
    vw_ws_caratteristiche_particella_plus.progressivo AS cp_progressivo,
    vw_ws_caratteristiche_particella_plus.codice_comune AS cp_codice_comune,
    vw_ws_caratteristiche_particella_plus.edificialita AS cp_edificialita,
    vw_ws_caratteristiche_particella_plus.classe AS cp_classe,
    vw_ws_caratteristiche_particella_plus.ettari AS cp_ettari,
    vw_ws_caratteristiche_particella_plus.are AS cp_are,
    vw_ws_caratteristiche_particella_plus.centiare AS cp_centiare,
    vw_ws_caratteristiche_particella_plus.flag_reddito AS cp_flag_reddito,
    vw_ws_caratteristiche_particella_plus.flag_porzione AS cp_flag_porzione,
    vw_ws_caratteristiche_particella_plus.flag_deduzioni AS cp_flag_deduzioni,
    vw_ws_caratteristiche_particella_plus.reddito_dominicale AS cp_reddito_dominicale,
    vw_ws_caratteristiche_particella_plus.reddito_agrario AS cp_reddito_agrario,
    vw_ws_caratteristiche_particella_plus.reddito_dominicale_euro AS cp_reddito_dominicale_euro,
    vw_ws_caratteristiche_particella_plus.reddito_agrario_euro AS cp_reddito_agrario_euro,
    vw_ws_caratteristiche_particella_plus.partita AS cp_partita,
    vw_ws_caratteristiche_particella_plus.annotazione AS cp_annotazione,
    vw_ws_caratteristiche_particella_plus.id_mutazionale_iniziale AS cp_id_mutazionale_iniziale,
    vw_ws_caratteristiche_particella_plus.id_mutazionale_finale AS cp_id_mutazionale_finale,
    vw_ws_caratteristiche_particella_plus.task_id AS cp_task_id,
    vw_ws_caratteristiche_particella_plus.qualita AS cp_qualita,
    vw_ws_caratteristiche_particella_plus.sezione AS cp_sezione
   FROM vw_ws_particella_up
     LEFT JOIN vw_ws_caratteristiche_particella_plus ON vw_ws_particella_up.id_par_prog = vw_ws_caratteristiche_particella_plus.id_par_prog;

ALTER TABLE public.vw_ws_particella_up_e_info_caratt_particella
    OWNER TO postgres;


CREATE OR REPLACE VIEW public.vw_ws_particella_up_e_info_caratt_particella_es
 AS
 SELECT vw_ws_particella_up_e_info_caratt_particella.pa_id_par_prog,
    vw_ws_particella_up_e_info_caratt_particella.pa_id,
    vw_ws_particella_up_e_info_caratt_particella.pa_id_particella,
    vw_ws_particella_up_e_info_caratt_particella.pa_progressivo,
    vw_ws_particella_up_e_info_caratt_particella.pa_codice_comune,
    vw_ws_particella_up_e_info_caratt_particella.pa_foglio,
    vw_ws_particella_up_e_info_caratt_particella.pa_numero,
    vw_ws_particella_up_e_info_caratt_particella.pa_denominatore,
    vw_ws_particella_up_e_info_caratt_particella.pa_subalterno,
    vw_ws_particella_up_e_info_caratt_particella.pa_task_id,
    vw_ws_particella_up_e_info_caratt_particella.pa_sezione,
    vw_ws_particella_up_e_info_caratt_particella.cp_id_par_prog,
    vw_ws_particella_up_e_info_caratt_particella.cp_id,
    vw_ws_particella_up_e_info_caratt_particella.cp_id_particella,
    vw_ws_particella_up_e_info_caratt_particella.cp_progressivo,
    vw_ws_particella_up_e_info_caratt_particella.cp_codice_comune,
    vw_ws_particella_up_e_info_caratt_particella.cp_edificialita,
    vw_ws_particella_up_e_info_caratt_particella.cp_classe,
    vw_ws_particella_up_e_info_caratt_particella.cp_ettari,
    vw_ws_particella_up_e_info_caratt_particella.cp_are,
    vw_ws_particella_up_e_info_caratt_particella.cp_centiare,
    vw_ws_particella_up_e_info_caratt_particella.cp_flag_reddito,
    vw_ws_particella_up_e_info_caratt_particella.cp_flag_porzione,
    vw_ws_particella_up_e_info_caratt_particella.cp_flag_deduzioni,
    vw_ws_particella_up_e_info_caratt_particella.cp_reddito_dominicale,
    vw_ws_particella_up_e_info_caratt_particella.cp_reddito_agrario,
    vw_ws_particella_up_e_info_caratt_particella.cp_reddito_dominicale_euro,
    vw_ws_particella_up_e_info_caratt_particella.cp_reddito_agrario_euro,
    vw_ws_particella_up_e_info_caratt_particella.cp_partita,
    vw_ws_particella_up_e_info_caratt_particella.cp_annotazione,
    vw_ws_particella_up_e_info_caratt_particella.cp_id_mutazionale_iniziale,
    vw_ws_particella_up_e_info_caratt_particella.cp_id_mutazionale_finale,
    vw_ws_particella_up_e_info_caratt_particella.cp_task_id,
    vw_ws_particella_up_e_info_caratt_particella.cp_qualita,
    vw_ws_particella_up_e_info_caratt_particella.cp_sezione
   FROM vw_ws_particella_up_e_info_caratt_particella
  WHERE vw_ws_particella_up_e_info_caratt_particella.cp_qualita IS NULL OR vw_ws_particella_up_e_info_caratt_particella.cp_qualita <> 998;

ALTER TABLE public.vw_ws_particella_up_e_info_caratt_particella_es
    OWNER TO postgres;


CREATE OR REPLACE VIEW public."dcn_Particelle_old"
 AS
 SELECT vw_ws_particella_up_e_info_caratt_particella_es.pa_codice_comune AS "codComune",
    vw_ws_particella_up_e_info_caratt_particella_es.pa_sezione AS sezione,
    vw_ws_particella_up_e_info_caratt_particella_es.pa_id_particella AS "idImmobile",
    'T'::character varying(1) AS "tipoImmobile",
    vw_ws_particella_up_e_info_caratt_particella_es.pa_foglio::integer AS foglio,
    vw_ws_particella_up_e_info_caratt_particella_es.pa_numero::integer::character varying(5) AS numero,
    replace(ltrim(replace(vw_ws_particella_up_e_info_caratt_particella_es.pa_subalterno::text, '0'::text, ' '::text)), ' '::text, '0'::text)::character varying(4) AS subalterno
   FROM vw_ws_particella_up_e_info_caratt_particella_es
  ORDER BY vw_ws_particella_up_e_info_caratt_particella_es.pa_sezione, (vw_ws_particella_up_e_info_caratt_particella_es.pa_foglio::integer), (vw_ws_particella_up_e_info_caratt_particella_es.pa_numero::integer::character varying(5)), vw_ws_particella_up_e_info_caratt_particella_es.pa_id_particella;

ALTER TABLE public."dcn_Particelle_old"
    OWNER TO postgres;

CREATE MATERIALIZED VIEW public."dcn_Particelle"
TABLESPACE pg_default
AS
 SELECT vw_ws_particella_up_e_info_caratt_particella_es.pa_codice_comune AS "codComune",
    vw_ws_particella_up_e_info_caratt_particella_es.pa_sezione AS sezione,
    vw_ws_particella_up_e_info_caratt_particella_es.pa_id_particella AS "idImmobile",
    'T'::character varying(1) AS "tipoImmobile",
    vw_ws_particella_up_e_info_caratt_particella_es.pa_foglio::integer AS foglio,
    vw_ws_particella_up_e_info_caratt_particella_es.pa_numero::integer::character varying(5) AS numero,
    replace(ltrim(replace(vw_ws_particella_up_e_info_caratt_particella_es.pa_subalterno::text, '0'::text, ' '::text)), ' '::text, '0'::text)::character varying(4) AS subalterno
   FROM vw_ws_particella_up_e_info_caratt_particella_es
WITH DATA;

ALTER TABLE public."dcn_Particelle"
    OWNER TO postgres;