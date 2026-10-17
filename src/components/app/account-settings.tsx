import { createClient } from '@/lib/supabase/server';
import { AccountCard, type AccountProfile } from '@/app/[locale]/(app)/account/account-card';
import { EmailCard } from '@/app/[locale]/(app)/account/email-card';
import { PasswordCard } from '@/app/[locale]/(app)/account/password-card';

/**
 * Account settings — name, photo, email, password — shared by clients and
 * experts so both roles get the same screen and there's one place to change
 * it. An expert's *studio* details live separately, under Studio.
 */
export async function AccountSettings({
  locale,
  openPassword = false,
}: {
  locale: string;
  openPassword?: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, role, marketing_consent, created_at, avatar_url, city, phone')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <section>
        <AccountCard
          email={user.email ?? ''}
          locale={locale}
          profile={{
            display_name: profile?.display_name ?? '',
            role: (profile?.role as AccountProfile['role']) ?? null,
            marketing_consent: profile?.marketing_consent ?? false,
            created_at: profile?.created_at ?? null,
            avatar_url: profile?.avatar_url ?? null,
            city: profile?.city ?? null,
            phone: profile?.phone ?? null,
          }}
        />
      </section>

      <section>
        <EmailCard email={user.email ?? ''} />
      </section>

      <section>
        <PasswordCard locale={locale} openByDefault={openPassword} />
      </section>
    </div>
  );
}
