import { supabase } from "@/integrations/supabase/client";

const createFinancialTables = async () => {
  try {
    console.log("Creating financial tables...");

    // Create ENUM types
    const enumQueries = [
      `CREATE TYPE IF NOT EXISTS public.transaction_type AS ENUM ('income', 'expense');`,
      `CREATE TYPE IF NOT EXISTS public.budget_period AS ENUM ('monthly', 'quarterly', 'yearly');`,
      `CREATE TYPE IF NOT EXISTS public.payment_method AS ENUM ('cash', 'bank_transfer', 'cheque', 'digital_wallet', 'direct_benefit_transfer');`
    ];

    for (const query of enumQueries) {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql: query });
      if (error) console.log(`Enum creation note: ${error.message}`);
    }

    // Create financial_transactions table
    const transactionsQuery = `
      CREATE TABLE IF NOT EXISTS public.financial_transactions (
        transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        type transaction_type NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
        description TEXT NOT NULL,
        date DATE NOT NULL,
        payment_method payment_method,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;

    const { error: transactionsError } = await (supabase.rpc as any)('exec_sql', { sql: transactionsQuery });
    if (transactionsError) {
      console.log(`Transactions table creation note: ${transactionsError.message}`);
    } else {
      console.log("✅ Financial transactions table created");
    }

    // Create budgets table
    const budgetsQuery = `
      CREATE TABLE IF NOT EXISTS public.budgets (
        budget_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
        category VARCHAR(100) NOT NULL,
        planned_amount DECIMAL(12,2) NOT NULL CHECK (planned_amount >= 0),
        spent_amount DECIMAL(12,2) DEFAULT 0 CHECK (spent_amount >= 0),
        period budget_period NOT NULL DEFAULT 'monthly',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `;

    const { error: budgetsError } = await (supabase.rpc as any)('exec_sql', { sql: budgetsQuery });
    if (budgetsError) {
      console.log(`Budgets table creation note: ${budgetsError.message}`);
    } else {
      console.log("✅ Budgets table created");
    }

    // Enable Row Level Security
    const rlsQueries = [
      `ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;`
    ];

    for (const query of rlsQueries) {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql: query });
      if (error) console.log(`RLS enable note: ${error.message}`);
    }

    // Create RLS Policies
    const policyQueries = [
      `CREATE POLICY IF NOT EXISTS "Users can view their own transactions" ON public.financial_transactions FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can create their own transactions" ON public.financial_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can update their own transactions" ON public.financial_transactions FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can delete their own transactions" ON public.financial_transactions FOR DELETE USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can view their own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can create their own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can update their own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);`,
      `CREATE POLICY IF NOT EXISTS "Users can delete their own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);`
    ];

    for (const query of policyQueries) {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql: query });
      if (error) console.log(`Policy creation note: ${error.message}`);
    }

    // Create indexes
    const indexQueries = [
      `CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON public.financial_transactions(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON public.financial_transactions(date);`,
      `CREATE INDEX IF NOT EXISTS idx_financial_transactions_type ON public.financial_transactions(type);`,
      `CREATE INDEX IF NOT EXISTS idx_financial_transactions_category ON public.financial_transactions(category);`,
      `CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);`,
      `CREATE INDEX IF NOT EXISTS idx_budgets_category ON public.budgets(category);`
    ];

    for (const query of indexQueries) {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql: query });
      if (error) console.log(`Index creation note: ${error.message}`);
    }

    // Create triggers for updated_at
    const triggerQueries = [
      `CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;`,
      `DROP TRIGGER IF EXISTS update_financial_transactions_updated_at ON public.financial_transactions;`,
      `CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();`,
      `DROP TRIGGER IF EXISTS update_budgets_updated_at ON public.budgets;`,
      `CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();`
    ];

    for (const query of triggerQueries) {
      const { error } = await (supabase.rpc as any)('exec_sql', { sql: query });
      if (error) console.log(`Trigger creation note: ${error.message}`);
    }

    console.log("🎉 Financial tables setup complete!");
    console.log("You can now use the FinancialManagement component.");

  } catch (error) {
    console.error("Error creating financial tables:", error);
    console.log("\nNote: If you're seeing RPC function errors, you may need to:");
    console.log("1. Run this SQL manually in your Supabase SQL editor, or");
    console.log("2. Use the Supabase CLI to apply the migration");
  }
};

// Execute the table creation
createFinancialTables();