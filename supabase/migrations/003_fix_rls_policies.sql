-- =============================================
-- RLS 정책 수정 및 보완 (003)
-- =============================================

-- =============================================
-- 프로필 정책 보완: INSERT 정책 추가
-- =============================================
-- 기존: SELECT, UPDATE만 허용
-- 추가: INSERT 허용 (upsert 지원)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- 크레딧 테이블 UPDATE 정책 추가
-- =============================================
-- 기존: SELECT만 허용
-- 추가: UPDATE 허용 (Edge Function 또는 클라이언트에서 크레딧 차감)

-- user_credits UPDATE 정책
DROP POLICY IF EXISTS "Users can update own credits" ON user_credits;
CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- legal_review_credits UPDATE 정책
DROP POLICY IF EXISTS "Users can update own legal credits" ON legal_review_credits;
CREATE POLICY "Users can update own legal credits"
  ON legal_review_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- 채팅 메시지 UPDATE 정책 개선
-- =============================================
-- 기존: 모든 필드 수정 가능 (보안 취약)
-- 개선: 자신이 받은 메시지의 is_read만 수정 가능하도록 의도
-- (참고: 완전한 필드 제한은 트리거 또는 애플리케이션 레벨에서 처리 필요)

DROP POLICY IF EXISTS "Chat participants can update messages" ON chat_messages;
-- 자신이 보낸 메시지가 아닌 경우에만 업데이트 허용 (읽음 표시용)
CREATE POLICY "Chat participants can mark messages as read"
  ON chat_messages FOR UPDATE
  USING (
    sender_id != auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  );

-- =============================================
-- 결제 내역 INSERT 정책 추가
-- =============================================
-- 사용자가 결제 내역을 생성할 수 있어야 함
DROP POLICY IF EXISTS "Users can insert own payment history" ON payment_history;
CREATE POLICY "Users can insert own payment history"
  ON payment_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 환경설정 INSERT 정책 추가
-- =============================================
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 프로필 조회 정책 (수정됨)
-- =============================================
-- 중요: 자기 자신의 프로필은 항상 조회 가능해야 함!
-- 기존 정책을 제거하지 않고 유지

-- 자기 자신 프로필 조회 정책 (반드시 필요!)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 연결된 사용자 프로필 조회 정책 (계약서/채팅용)
DROP POLICY IF EXISTS "Users can view related profiles" ON profiles;
CREATE POLICY "Users can view related profiles"
  ON profiles FOR SELECT
  USING (
    -- 계약서를 통해 연결된 사용자
    EXISTS (
      SELECT 1 FROM contracts
      WHERE (contracts.employer_id = auth.uid() AND contracts.worker_id = id)
         OR (contracts.worker_id = auth.uid() AND contracts.employer_id = id)
    ) OR
    -- 채팅방을 통해 연결된 사용자
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE (chat_rooms.employer_id = auth.uid() AND chat_rooms.worker_id = id)
         OR (chat_rooms.worker_id = auth.uid() AND chat_rooms.employer_id = id)
    )
  );

-- =============================================
-- 계약서 초대 UPDATE 정책 추가
-- =============================================
DROP POLICY IF EXISTS "Workers can update invitations" ON contract_invitations;
CREATE POLICY "Workers can update invitations"
  ON contract_invitations FOR UPDATE
  USING (
    -- 초대받은 전화번호와 연결된 사용자이거나
    worker_id = auth.uid() OR
    -- 계약서 소유자인 경우
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_invitations.contract_id
      AND contracts.employer_id = auth.uid()
    )
  );
