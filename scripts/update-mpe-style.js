import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const sourceFilePath = path.join(
  projectRoot,
  'shd101wyy.markdown-preview-enhanced/github-light.less'
)

const targetFilePath = path.join(os.homedir(), '.local/state/crossnote/style.less')

const backupsDir = path.join(projectRoot, 'backups')

main()

async function main() {
  await mkdir(backupsDir, { recursive: true })

  const now = new Date()
  const timestamp = formatTimestamp(now)
  const backupFilePath = path.join(backupsDir, `style-${timestamp}.less`)

  await copyFile(targetFilePath, backupFilePath)

  const sourceContent = await readFile(sourceFilePath, 'utf8')
  const updateComment = `/* Last update at: ${formatReadableDatetime(now)} */`
  const targetContent = `${updateComment}\n\n${sourceContent}`
  await writeFile(targetFilePath, targetContent, 'utf8')

  console.log(`Replaced file path: ${targetFilePath}`)
  console.log(`Backup file path: ${backupFilePath}`)
}

function formatTimestamp(date) {
  const yyyy = String(date.getFullYear())
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`
}

function formatReadableDatetime(date) {
  const yyyy = String(date.getFullYear())
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}
