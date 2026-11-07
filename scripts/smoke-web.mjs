import { chromium } from 'playwright';

const BASE = process.env.FLOODSHIELD_URL ?? 'http://localhost:8081';

async function clickButton(page, name) {
  const button = page.getByRole('button', { name, exact: true }).first();
  await button.scrollIntoViewIfNeeded();
  await button.click({ timeout: 20000 });
}

async function fillByLabel(page, label, value) {
  const field = page.getByText(label, { exact: true }).locator('xpath=following-sibling::*[1]');
  await field.waitFor({ state: 'visible', timeout: 15000 });
  await field.click();
  await field.fill(value);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
const errors = [];

page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Clear previous session so login is always tested.
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  await clickButton(page, 'Entrar');
  await page.waitForTimeout(1200);

  await fillByLabel(page, 'E-mail', 'cidadao@floodshield.app');
  await fillByLabel(page, 'Senha', '123456');
  await clickButton(page, 'Entrar');
  await page.waitForTimeout(3000);

  await page.getByText('STATUS DA REGIÃO').waitFor({ timeout: 20000 });

  await page.getByText('Ocorrências', { exact: true }).last().click();
  await page.waitForTimeout(1200);
  await clickButton(page, 'Nova ocorrência');
  await page.waitForTimeout(1000);

  const stamp = Date.now();
  await fillByLabel(page, 'Título', `Teste alagamento ${stamp}`);
  await fillByLabel(page, 'Bairro', 'Penha');
  await fillByLabel(page, 'Nível da água (cm)', '55');
  await fillByLabel(page, 'Descrição', 'Smoke test automatizado do FloodShield.');
  await clickButton(page, 'Salvar');
  await page.waitForTimeout(2500);

  await page.getByText('Detalhe').first().waitFor({ timeout: 15000 });
  await clickButton(page, 'Gerar plano de ação');
  await page.waitForTimeout(1500);
  await page.getByText('Plano de ação').first().waitFor({ timeout: 15000 });

  await page.getByText('Abrigos', { exact: true }).last().click();
  await page.waitForTimeout(1200);
  await page.getByText('Escola Municipal Penha').waitFor({ timeout: 15000 });

  await page.getByText('Check-in', { exact: true }).last().click();
  await page.waitForTimeout(1000);
  await clickButton(page, 'Estou seguro');
  await page.waitForTimeout(1000);

  await page.getByText('Sobre', { exact: true }).last().click();
  await page.waitForTimeout(1000);
  await page.getByText('Commit de referência', { exact: true }).waitFor({ timeout: 15000 });
  await page.getByText(/Raphael Gomes Mancera/).first().scrollIntoViewIfNeeded();
  await page.getByText(/Raphael Gomes Mancera/).first().waitFor({ state: 'visible', timeout: 15000 });



  console.log('SMOKE OK');
} catch (error) {
  console.error('SMOKE FAIL');
  console.error(error);
  console.error('Captured errors:', errors);
  await page.screenshot({ path: 'smoke-fail.png', fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
}
