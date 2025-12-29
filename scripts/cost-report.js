require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function getCostReport() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    try {
        console.log('💰 Relatório de Custos da API Gemini\n')
        console.log('═'.repeat(80))

        // Total geral
        const totalResult = await pool.query(`
            SELECT 
                COUNT(*) as total_generations,
                SUM(prompt_tokens) as total_prompt_tokens,
                SUM(candidates_tokens) as total_candidates_tokens,
                SUM(total_tokens) as total_tokens,
                SUM(input_cost_usd) as total_input_cost,
                SUM(output_cost_usd) as total_output_cost,
                SUM(total_cost_usd) as total_cost
            FROM generated_images
            WHERE total_cost_usd IS NOT NULL
        `)

        const total = totalResult.rows[0]

        console.log('\n📊 RESUMO GERAL')
        console.log('─'.repeat(80))
        console.log(`Total de Gerações:        ${total.total_generations || 0}`)
        console.log(`Total de Tokens (Input):  ${Number(total.total_prompt_tokens || 0).toLocaleString()}`)
        console.log(`Total de Tokens (Output): ${Number(total.total_candidates_tokens || 0).toLocaleString()}`)
        console.log(`Total de Tokens:          ${Number(total.total_tokens || 0).toLocaleString()}`)
        console.log()
        console.log(`💵 Custo Total (Input):   $${Number(total.total_input_cost || 0).toFixed(6)}`)
        console.log(`💵 Custo Total (Output):  $${Number(total.total_output_cost || 0).toFixed(6)}`)
        console.log(`💵 CUSTO TOTAL:           $${Number(total.total_cost || 0).toFixed(6)}`)

        // Por tipo de saída
        const byTypeResult = await pool.query(`
            SELECT 
                output_type,
                COUNT(*) as count,
                SUM(total_tokens) as total_tokens,
                SUM(total_cost_usd) as total_cost
            FROM generated_images
            WHERE total_cost_usd IS NOT NULL
            GROUP BY output_type
            ORDER BY total_cost DESC
        `)

        if (byTypeResult.rows.length > 0) {
            console.log('\n\n📈 CUSTOS POR TIPO DE SAÍDA')
            console.log('─'.repeat(80))
            byTypeResult.rows.forEach(row => {
                const typeLabels = {
                    front: 'Frente',
                    back: 'Costa',
                    real_situation: 'Situação Real'
                }
                console.log(`\n${typeLabels[row.output_type] || row.output_type}:`)
                console.log(`  Gerações: ${row.count}`)
                console.log(`  Tokens:   ${Number(row.total_tokens || 0).toLocaleString()}`)
                console.log(`  Custo:    $${Number(row.total_cost || 0).toFixed(6)}`)
            })
        }

        // Por usuário (se houver)
        const byUserResult = await pool.query(`
            SELECT 
                u.email,
                COUNT(g.id) as count,
                SUM(g.total_tokens) as total_tokens,
                SUM(g.total_cost_usd) as total_cost
            FROM generated_images g
            LEFT JOIN users u ON g.user_id = u.id
            WHERE g.total_cost_usd IS NOT NULL
            GROUP BY u.email
            ORDER BY total_cost DESC
            LIMIT 10
        `)

        if (byUserResult.rows.length > 0) {
            console.log('\n\n👥 TOP 10 USUÁRIOS POR CUSTO')
            console.log('─'.repeat(80))
            byUserResult.rows.forEach((row, index) => {
                console.log(`\n${index + 1}. ${row.email || 'Sem email'}`)
                console.log(`   Gerações: ${row.count}`)
                console.log(`   Tokens:   ${Number(row.total_tokens || 0).toLocaleString()}`)
                console.log(`   Custo:    $${Number(row.total_cost || 0).toFixed(6)}`)
            })
        }

        // Últimas 5 gerações
        const recentResult = await pool.query(`
            SELECT 
                output_type,
                total_tokens,
                total_cost_usd,
                created_at
            FROM generated_images
            WHERE total_cost_usd IS NOT NULL
            ORDER BY created_at DESC
            LIMIT 5
        `)

        if (recentResult.rows.length > 0) {
            console.log('\n\n🕐 ÚLTIMAS 5 GERAÇÕES')
            console.log('─'.repeat(80))
            recentResult.rows.forEach((row, index) => {
                const typeLabels = {
                    front: 'Frente',
                    back: 'Costa',
                    real_situation: 'Situação Real'
                }
                console.log(`\n${index + 1}. ${typeLabels[row.output_type] || row.output_type}`)
                console.log(`   Data:   ${new Date(row.created_at).toLocaleString('pt-BR')}`)
                console.log(`   Tokens: ${Number(row.total_tokens || 0).toLocaleString()}`)
                console.log(`   Custo:  $${Number(row.total_cost_usd || 0).toFixed(6)}`)
            })
        }

        console.log('\n' + '═'.repeat(80))
        console.log('\n✅ Relatório gerado com sucesso!\n')

    } catch (error) {
        console.error('❌ Erro ao gerar relatório:', error.message)
    } finally {
        await pool.end()
    }
}

getCostReport()
