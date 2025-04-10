# Neothink DAO Token System

## Overview

The Neothink DAO token system is designed to incentivize meaningful participation and reward valuable contributions to the community. The system uses four distinct token types, each representing different aspects of personal and community growth.

## Token Types

### LUCK 🍀
- **Purpose**: Rewards valuable insights and serendipitous discoveries
- **Primary Earning Methods**:
  - Sunday posts (5 LUCK)
  - High-engagement posts (1-3 LUCK bonus)
  - First-time insights (2 LUCK)
- **Special Conditions**:
  - Maximum 5 LUCK tokens per day from posts
  - Sunday posts must be made between 12:00 AM and 11:59 PM local time
  - Premium members earn 2x LUCK
  - Superachievers earn 3x LUCK

### LIVE 🌱
- **Purpose**: Encourages vitality practices and embodiment
- **Primary Earning Methods**:
  - Health-related content (2 LIVE)
  - Wellness challenge participation (5 LIVE)
  - Progress updates (1 LIVE)
- **Special Conditions**:
  - Maximum 10 LIVE tokens per day
  - Must include specific health tags for bonus rewards
  - Premium members earn 2x LIVE
  - Superachievers earn 3x LIVE

### LOVE ❤️
- **Purpose**: Fosters connections and community participation
- **Primary Earning Methods**:
  - Chat activity (10 LOVE per day max)
  - Helpful responses (2-5 LOVE)
  - Community support (1-3 LOVE)
- **Special Conditions**:
  - Premium chat rooms give 2x LOVE
  - Superachiever rooms give 3x LOVE
  - Maximum 20 LOVE tokens per day
  - Messages must be at least 20 characters long

### LIFE ✨
- **Purpose**: Rewards profound wisdom and life observations
- **Primary Earning Methods**:
  - Philosophical insights (3 LIFE)
  - Wisdom sharing (2 LIFE)
  - Breakthrough moments (5 LIFE)
- **Special Conditions**:
  - Maximum 15 LIFE tokens per day
  - Must be validated by community engagement
  - Premium members earn 2x LIFE
  - Superachievers earn 3x LIFE

## Technical Implementation

### Database Schema

```sql
-- Token balances table
CREATE TABLE token_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    luck_balance INTEGER NOT NULL DEFAULT 0,
    live_balance INTEGER NOT NULL DEFAULT 0,
    love_balance INTEGER NOT NULL DEFAULT 0,
    life_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Token transactions table
CREATE TABLE token_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_type TEXT NOT NULL CHECK (token_type IN ('LUCK', 'LIVE', 'LOVE', 'LIFE')),
    amount INTEGER NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('post', 'message', 'zoom', 'other')),
    source_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Helper Functions

```sql
-- Award tokens function
CREATE OR REPLACE FUNCTION award_tokens(
    p_user_id UUID,
    p_token_type TEXT,
    p_amount INTEGER,
    p_source_type TEXT,
    p_source_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Record the transaction
    INSERT INTO token_transactions (...) VALUES (...);
    
    -- Update the balance
    UPDATE token_balances SET ... WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check daily limits function
CREATE OR REPLACE FUNCTION can_earn_tokens(
    p_user_id UUID,
    p_token_type TEXT,
    p_source_type TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    -- Check daily limits based on token type and source
    -- Return true if user can earn more tokens today
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Real-time Subscriptions

```typescript
// Subscribe to token updates
const channel = supabase
  .channel('token_updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'token_transactions',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      // Handle token update
    }
  )
  .subscribe()
```

## Frontend Components

### TokenBalance Component
```typescript
<TokenBalance
  userId={userId}
  supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
  supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
/>
```

### TokenHistory Component
```typescript
<TokenHistory
  userId={userId}
  supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
  supabaseKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
  tokenType="LUCK" // Optional: filter by token type
  limit={20} // Optional: limit number of transactions
  offset={0} // Optional: pagination offset
/>
```

## Security Considerations

1. **Row Level Security (RLS)**
   - Users can only view their own token balances and transactions
   - Token awards are handled by secure server-side functions
   - Premium features are restricted based on subscription status

2. **Rate Limiting**
   - Daily token earning limits prevent abuse
   - Transaction validation ensures proper token distribution
   - Subscription tier multipliers are enforced server-side

3. **Audit Trail**
   - All token transactions are logged with source and timestamp
   - Token balances maintain updated_at timestamp
   - Real-time notifications for suspicious activity

## Best Practices

1. **Token Awards**
   - Always use the `award_tokens` function to maintain consistency
   - Check daily limits before awarding tokens
   - Include clear source identification for audit purposes

2. **Real-time Updates**
   - Subscribe to token changes for immediate UI updates
   - Handle connection errors gracefully
   - Implement retry logic for failed transactions

3. **User Experience**
   - Show clear token earning opportunities
   - Provide immediate feedback on token awards
   - Display progress towards daily limits

## Future Enhancements

1. **Token Economy**
   - Token exchange system between types
   - Special event multipliers
   - Community challenges with token rewards

2. **Analytics**
   - Token earning patterns
   - Community engagement metrics
   - Token velocity tracking

3. **Integration**
   - Web3 wallet integration
   - NFT rewards for token milestones
   - Cross-platform token earning 