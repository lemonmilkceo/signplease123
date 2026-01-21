-- =============================================
-- Row Level Security (RLS) 정책
-- =============================================

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_review_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 프로필 정책: 본인만 조회/수정 가능
-- =============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =============================================
-- 계약서 정책: 작성자/참여자만 접근
-- =============================================
DROP POLICY IF EXISTS "Employers can view own contracts" ON contracts;
CREATE POLICY "Employers can view own contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Workers can view assigned contracts" ON contracts;
CREATE POLICY "Workers can view assigned contracts"
  ON contracts FOR SELECT
  USING (auth.uid() = worker_id);

DROP POLICY IF EXISTS "Employers can create contracts" ON contracts;
CREATE POLICY "Employers can create contracts"
  ON contracts FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can update own contracts" ON contracts;
CREATE POLICY "Employers can update own contracts"
  ON contracts FOR UPDATE
  USING (auth.uid() = employer_id);

-- 근로자는 자신에게 할당된 계약서만 수정 가능 (서명용)
DROP POLICY IF EXISTS "Workers can update assigned contracts" ON contracts;
CREATE POLICY "Workers can update assigned contracts"
  ON contracts FOR UPDATE
  USING (auth.uid() = worker_id);

-- =============================================
-- 폴더 정책: 본인만 접근
-- =============================================
DROP POLICY IF EXISTS "Users can manage own folders" ON contract_folders;
CREATE POLICY "Users can manage own folders"
  ON contract_folders FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- 초대 정책
-- =============================================
DROP POLICY IF EXISTS "Employers can view contract invitations" ON contract_invitations;
CREATE POLICY "Employers can view contract invitations"
  ON contract_invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_invitations.contract_id
      AND contracts.employer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Anyone can view invitation by token" ON contract_invitations;
CREATE POLICY "Anyone can view invitation by token"
  ON contract_invitations FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Employers can create invitations" ON contract_invitations;
CREATE POLICY "Employers can create invitations"
  ON contract_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts
      WHERE contracts.id = contract_id
      AND contracts.employer_id = auth.uid()
    )
  );

-- =============================================
-- 크레딧 정책: 본인만 조회
-- =============================================
DROP POLICY IF EXISTS "Users can view own credits" ON user_credits;
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own legal review credits" ON legal_review_credits;
CREATE POLICY "Users can view own legal review credits"
  ON legal_review_credits FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- 채팅 정책: 참여자만 접근
-- =============================================
DROP POLICY IF EXISTS "Chat participants can view rooms" ON chat_rooms;
CREATE POLICY "Chat participants can view rooms"
  ON chat_rooms FOR SELECT
  USING (auth.uid() = employer_id OR auth.uid() = worker_id);

DROP POLICY IF EXISTS "Chat participants can create rooms" ON chat_rooms;
CREATE POLICY "Chat participants can create rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (auth.uid() = employer_id OR auth.uid() = worker_id);

DROP POLICY IF EXISTS "Chat participants can view messages" ON chat_messages;
CREATE POLICY "Chat participants can view messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Chat participants can send messages" ON chat_messages;
CREATE POLICY "Chat participants can send messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Chat participants can update messages" ON chat_messages;
CREATE POLICY "Chat participants can update messages"
  ON chat_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_messages.room_id
      AND (chat_rooms.employer_id = auth.uid() OR chat_rooms.worker_id = auth.uid())
    )
  );

-- =============================================
-- 리뷰 정책
-- =============================================
DROP POLICY IF EXISTS "Employers can create reviews" ON worker_reviews;
CREATE POLICY "Employers can create reviews"
  ON worker_reviews FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Users can view related reviews" ON worker_reviews;
CREATE POLICY "Users can view related reviews"
  ON worker_reviews FOR SELECT
  USING (auth.uid() = employer_id OR auth.uid() = worker_id);

-- =============================================
-- 결제 내역 정책: 본인만 조회
-- =============================================
DROP POLICY IF EXISTS "Users can view own payment history" ON payment_history;
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================
-- 환경설정 정책: 본인만 접근
-- =============================================
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
CREATE POLICY "Users can manage own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
