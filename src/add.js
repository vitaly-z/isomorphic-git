import fs from './managers/models/utils/fs'
import path from 'path'
import pify from 'pify'
import GitIndexManager from './managers/GitIndexManager'
import GitObjectManager from './managers/GitObjectManager'
import { read } from './managers/models/utils/read'

export async function add ({ gitdir, workdir, filepath }) {
  const type = 'blob'
  const object = await read(path.join(workdir, filepath))
  if (object === null) throw new Error(`Could not read file '${filepath}'`)
  const oid = await GitObjectManager.write({ gitdir, type, object })
  await GitIndexManager.acquire(`${gitdir}/index`, async function (index) {
    let stats = await pify(fs().lstat)(path.join(workdir, filepath))
    index.insert({ filepath, stats, oid })
  })
  // TODO: return oid?
}