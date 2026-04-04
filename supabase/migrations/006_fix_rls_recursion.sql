-- ============================================================================
-- 006. FIX RLS RECURSION
-- ============================================================================
-- Se introducen funciones SECURITY DEFINER para verificar roles de usuario
-- sin disparar políticas recursivas sobre la tabla 'profiles'.
-- ============================================================================

-- 1. FUNCIONES AUXILIARES (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
-- Estas funciones se ejecutan con privilegios de sistema, saltándose el RLS.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_mod()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CORREGIR POLÍTICAS RECURSIVAS DE PROFILES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_select ON public.profiles;
CREATE POLICY profiles_select ON public.profiles
  FOR SELECT USING (
    status = 'active'
    OR id = auth.uid()
    OR public.is_admin_or_mod()
  );

DROP POLICY IF EXISTS profiles_admin_update ON public.profiles;
CREATE POLICY profiles_admin_update ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- 3. CORREGIR POLÍTICAS DE USER DOCUMENTS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS user_documents_select ON public.user_documents;
CREATE POLICY user_documents_select ON public.user_documents
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_admin_or_mod()
  );

DROP POLICY IF EXISTS user_documents_admin_update ON public.user_documents;
CREATE POLICY user_documents_admin_update ON public.user_documents
  FOR UPDATE USING (public.is_admin_or_mod());

-- 4. CORREGIR POLÍTICAS DE PROPERTIES
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS properties_select ON public.properties;
CREATE POLICY properties_select ON public.properties
  FOR SELECT USING (
    (status = 'active' AND deleted_at IS NULL)
    OR owner_id = auth.uid()
    OR public.is_admin_or_mod()
  );

DROP POLICY IF EXISTS properties_admin_update ON public.properties;
CREATE POLICY properties_admin_update ON public.properties
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS properties_delete ON public.properties;
CREATE POLICY properties_delete ON public.properties
  FOR DELETE USING (
    owner_id = auth.uid()
    OR public.is_admin()
  );

-- 5. CORREGIR POLÍTICAS DE REVIEWS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS reviews_select ON public.reviews;
CREATE POLICY reviews_select ON public.reviews
  FOR SELECT USING (
    status = 'visible'
    OR reviewer_id = auth.uid()
    OR public.is_admin_or_mod()
  );

DROP POLICY IF EXISTS reviews_admin_update ON public.reviews;
CREATE POLICY reviews_admin_update ON public.reviews
  FOR UPDATE USING (public.is_admin_or_mod());

-- 6. CORREGIR POLÍTICAS DE TRUST EVENTS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS trust_events_select ON public.trust_events;
CREATE POLICY trust_events_select ON public.trust_events
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_admin()
  );

-- 7. CORREGIR POLÍTICAS DE REPORTS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS reports_select ON public.reports;
CREATE POLICY reports_select ON public.reports
  FOR SELECT USING (
    reporter_id = auth.uid()
    OR public.is_admin_or_mod()
  );

DROP POLICY IF EXISTS reports_admin_update ON public.reports;
CREATE POLICY reports_admin_update ON public.reports
  FOR UPDATE USING (public.is_admin_or_mod());

-- 8. CORREGIR POLÍTICAS DE ADMIN ACTIONS
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS admin_actions_select ON public.admin_actions;
CREATE POLICY admin_actions_select ON public.admin_actions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS admin_actions_insert ON public.admin_actions;
CREATE POLICY admin_actions_insert ON public.admin_actions
  FOR INSERT WITH CHECK (public.is_admin());
