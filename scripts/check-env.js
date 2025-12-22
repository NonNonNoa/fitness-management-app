#!/usr/bin/env node

/**
 * 環境変数チェックスクリプト
 * 必要な環境変数がすべて設定されているか確認します
 */

const requiredEnvVars = [
  'TURSO_DATABASE_URL',
  'TURSO_AUTH_TOKEN',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_APP_URL',
];

const optionalEnvVars = [
  'OPENAI_API_KEY',
];

console.log('🔍 環境変数のチェックを開始します...\n');

let hasErrors = false;
let hasWarnings = false;

// 必須環境変数のチェック
console.log('📋 必須環境変数:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === '' || value.includes('your-') || value.includes('example')) {
    console.log(`  ❌ ${varName}: 未設定またはデフォルト値のまま`);
    hasErrors = true;
  } else {
    // 機密情報は一部のみ表示
    const displayValue = varName.includes('SECRET') || varName.includes('TOKEN') || varName.includes('KEY')
      ? `${value.substring(0, 8)}...` 
      : value;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n📋 オプション環境変数:');
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === '' || value.includes('your-') || value.includes('example')) {
    console.log(`  ⚠️  ${varName}: 未設定（AI機能を使用する場合は必要）`);
    hasWarnings = true;
  } else {
    const displayValue = `${value.substring(0, 8)}...`;
    console.log(`  ✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ エラー: 必須環境変数が設定されていません。');
  console.log('   以下のファイルを確認してください:');
  console.log('   - .env.local (ローカル開発環境)');
  console.log('   - Vercel Dashboard > Settings > Environment Variables (本番環境)');
  console.log('\n   詳細は docs/env-setup-guide.md を参照してください。\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  警告: 一部のオプション環境変数が設定されていません。');
  console.log('   AI機能を使用する場合は、OPENAI_API_KEY を設定してください。\n');
  process.exit(0);
} else {
  console.log('\n✅ すべての環境変数が正しく設定されています！\n');
  process.exit(0);
}


