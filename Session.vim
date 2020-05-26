let SessionLoad = 1
if &cp | set nocp | endif
let s:cpo_save=&cpo
set cpo&vim
inoremap <silent> <Plug>CocRefresh =coc#_complete()
inoremap <silent> <expr> <C-Space> coc#refresh()
inoremap <expr> <S-Tab> pumvisible() ? "\" : "\"
map! <D-v> *
snoremap <silent>  c
map  :NERDTreeToggle
nnoremap <silent>  :CtrlP
snoremap  "_c
xmap <silent>  <Plug>(coc-range-select)
nmap <silent>  <Plug>(coc-range-select)
nnoremap <silent>  p :CocListResume COC - autocompletion
nnoremap <silent>  k :CocPrev
nnoremap <silent>  j :CocNext
nnoremap <silent>  s :CocList -I symbols
nnoremap <silent>  o :CocList outline
nnoremap <silent>  c :CocList commands
nnoremap <silent>  e :CocList extensions
nnoremap <silent>  a :CocList diagnostics
nnoremap   za
nnoremap $ <Nop>
nmap ,p <Plug>(Prettier)
nmap ,qf <Plug>(coc-fix-current)
nmap ,ac <Plug>(coc-codeaction)
nmap ,a <Plug>(coc-codeaction-selected)
xmap ,a <Plug>(coc-codeaction-selected)
nmap ,f <Plug>(coc-format-selected)
xmap ,f <Plug>(coc-format-selected)
nmap ,rn <Plug>(coc-rename)
nnoremap ,vr :vertical resize 40
nnoremap ,s :mksession!
nnoremap ,sv :source $MYVIMRC
nnoremap ,ez :vsp ~/.zshrc
nnoremap ,ev :vsp $MYVIMRC
nnoremap ,u :GundoToggle
nnoremap ,  :nohlsearch
nnoremap B ^
nnoremap E $
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)
nnoremap ^ <Nop>
omap ac <Plug>(coc-classobj-a)
xmap ac <Plug>(coc-classobj-a)
omap af <Plug>(coc-funcobj-a)
xmap af <Plug>(coc-funcobj-a)
xmap gx <Plug>NetrwBrowseXVis
smap gx <Plug>NetrwBrowseXVis
nmap gx <Plug>NetrwBrowseX
nmap <silent> gr <Plug>(coc-references)
nmap <silent> gi <Plug>(coc-implementation)
nmap <silent> gy <Plug>(coc-type-definition)
nmap <silent> gd <Plug>(coc-definition)
nnoremap gV `[v`]
omap ic <Plug>(coc-classobj-i)
xmap ic <Plug>(coc-classobj-i)
omap if <Plug>(coc-funcobj-i)
xmap if <Plug>(coc-funcobj-i)
nnoremap j gj
nnoremap k gk
nnoremap <silent> <Plug>(PrettierCliPath) :PrettierCliPath
nnoremap <silent> <Plug>(PrettierCliVersion) :PrettierCliVersion
nnoremap <silent> <Plug>(PrettierCli) :PrettierCli
nnoremap <silent> <Plug>(PrettierVersion) :PrettierVersion
nnoremap <silent> <Plug>(PrettierPartial) :PrettierPartial
nnoremap <silent> <Plug>(PrettierFragment) :PrettierFragment
nnoremap <silent> <Plug>(PrettierAsync) :PrettierAsync
nnoremap <silent> <Plug>(Prettier) :Prettier
snoremap <silent> <BS> c
snoremap <silent> <Del> c
snoremap <silent> <C-H> c
snoremap <C-R> "_c
vnoremap <silent> <Plug>NetrwBrowseXVis :call netrw#BrowseXVis()
nnoremap <silent> <Plug>NetrwBrowseX :call netrw#BrowseX(expand((exists("g:netrw_gx")? g:netrw_gx : '<cfile>')),netrw#CheckIfRemote())
onoremap <silent> <Plug>(coc-classobj-a) :call coc#rpc#request('selectSymbolRange', [v:false, '', ['Interface', 'Struct', 'Class']])
onoremap <silent> <Plug>(coc-classobj-i) :call coc#rpc#request('selectSymbolRange', [v:true, '', ['Interface', 'Struct', 'Class']])
vnoremap <silent> <Plug>(coc-classobj-a) :call coc#rpc#request('selectSymbolRange', [v:false, visualmode(), ['Interface', 'Struct', 'Class']])
vnoremap <silent> <Plug>(coc-classobj-i) :call coc#rpc#request('selectSymbolRange', [v:true, visualmode(), ['Interface', 'Struct', 'Class']])
onoremap <silent> <Plug>(coc-funcobj-a) :call coc#rpc#request('selectSymbolRange', [v:false, '', ['Method', 'Function']])
onoremap <silent> <Plug>(coc-funcobj-i) :call coc#rpc#request('selectSymbolRange', [v:true, '', ['Method', 'Function']])
vnoremap <silent> <Plug>(coc-funcobj-a) :call coc#rpc#request('selectSymbolRange', [v:false, visualmode(), ['Method', 'Function']])
vnoremap <silent> <Plug>(coc-funcobj-i) :call coc#rpc#request('selectSymbolRange', [v:true, visualmode(), ['Method', 'Function']])
nnoremap <silent> <Plug>(coc-cursors-position) :call coc#rpc#request('cursorsSelect', [bufnr('%'), 'position', 'n'])
nnoremap <silent> <Plug>(coc-cursors-word) :call coc#rpc#request('cursorsSelect', [bufnr('%'), 'word', 'n'])
vnoremap <silent> <Plug>(coc-cursors-range) :call coc#rpc#request('cursorsSelect', [bufnr('%'), 'range', visualmode()])
nnoremap <Plug>(coc-refactor) :call       CocActionAsync('refactor')
nnoremap <Plug>(coc-command-repeat) :call       CocAction('repeatCommand')
nnoremap <Plug>(coc-float-jump) :call       coc#util#float_jump()
nnoremap <Plug>(coc-float-hide) :call       coc#util#float_hide()
nnoremap <Plug>(coc-fix-current) :call       CocActionAsync('doQuickfix')
nnoremap <Plug>(coc-openlink) :call       CocActionAsync('openLink')
nnoremap <Plug>(coc-references) :call       CocActionAsync('jumpReferences')
nnoremap <Plug>(coc-type-definition) :call       CocActionAsync('jumpTypeDefinition')
nnoremap <Plug>(coc-implementation) :call       CocActionAsync('jumpImplementation')
nnoremap <Plug>(coc-declaration) :call       CocActionAsync('jumpDeclaration')
nnoremap <Plug>(coc-definition) :call       CocActionAsync('jumpDefinition')
nnoremap <Plug>(coc-diagnostic-prev-error) :call       CocActionAsync('diagnosticPrevious', 'error')
nnoremap <Plug>(coc-diagnostic-next-error) :call       CocActionAsync('diagnosticNext',     'error')
nnoremap <Plug>(coc-diagnostic-prev) :call       CocActionAsync('diagnosticPrevious')
nnoremap <Plug>(coc-diagnostic-next) :call       CocActionAsync('diagnosticNext')
nnoremap <Plug>(coc-diagnostic-info) :call       CocActionAsync('diagnosticInfo')
nnoremap <Plug>(coc-format) :call       CocActionAsync('format')
nnoremap <Plug>(coc-rename) :call       CocActionAsync('rename')
nnoremap <Plug>(coc-codeaction-line) :call       CocActionAsync('codeAction',         'n')
nnoremap <Plug>(coc-codeaction) :call       CocActionAsync('codeAction',         '')
vnoremap <Plug>(coc-codeaction-selected) :call       CocActionAsync('codeAction',         visualmode())
vnoremap <Plug>(coc-format-selected) :call       CocActionAsync('formatSelected',     visualmode())
nnoremap <Plug>(coc-codelens-action) :call       CocActionAsync('codeLensAction')
nnoremap <Plug>(coc-range-select) :call       CocAction('rangeSelect',     '', v:true)
vnoremap <Plug>(coc-range-select-backward) :call       CocAction('rangeSelect',     visualmode(), v:false)
vnoremap <Plug>(coc-range-select) :call       CocAction('rangeSelect',     visualmode(), v:true)
nnoremap <silent> <C-P> :CtrlP
xmap <silent> <C-S> <Plug>(coc-range-select)
nmap <silent> <C-S> <Plug>(coc-range-select)
map <C-N> :NERDTreeToggle
xmap <BS> "-d
vmap <D-x> "*d
vmap <D-c> "*y
vmap <D-v> "-d"*P
nmap <D-v> "*P
inoremap <expr>  complete_info()["selected"] != "-1" ? "\" : "\u\"
inoremap  <Nop>
inoremap jk 
let &cpo=s:cpo_save
unlet s:cpo_save
set background=dark
set backspace=2
set cmdheight=2
set expandtab
set fileencodings=ucs-bom,utf-8,default,latin1
set foldlevelstart=10
set helplang=en
set hidden
set hlsearch
set incsearch
set laststatus=2
set lazyredraw
set modelines=0
set runtimepath=~/.vim,~/.vim/plugged/gundo.vim,~/.vim/plugged/ack.vim,~/.vim/plugged/vim-javascript,~/.vim/plugged/typescript-vim,~/.vim/plugged/vim-jsx-typescript,~/.vim/plugged/ctrlp.vim,~/.vim/plugged/vim-colors-xcode,~/.vim/plugged/nerdtree,~/.vim/plugged/nerdtree-git-plugin,~/.vim/plugged/coc.nvim,~/.vim/plugged/coc-eslint,~/.vim/plugged/coc-prettier,~/.vim/plugged/vim-airline,~/.vim/plugged/vim-airline-themes,~/.vim/plugged/vim-prettier,/usr/share/vim/vimfiles,/usr/share/vim/vim81,/usr/share/vim/vimfiles/after,~/.vim/plugged/vim-javascript/after,~/.vim/plugged/vim-jsx-typescript/after,~/.vim/after
set scrolloff=10
set shiftwidth=2
set shortmess=filnxtToOSc
set showcmd
set showmatch
set softtabstop=2
set statusline=%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}%{coc#status()}%{get(b:,'coc_current_function','')}
set tabstop=2
set updatetime=300
set wildignore=*.pyc
set wildmenu
set window=1
set nowritebackup
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/code/django/nights_cinema
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
argglobal
%argdel
$argadd .gitignore
edit frontend/src/pages/LandingPage.tsx
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 143 + 102) / 204)
exe 'vert 2resize ' . ((&columns * 60 + 102) / 204)
argglobal
setlocal keymap=
setlocal noarabic
setlocal autoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),0],:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://,b:#,:%,:XCOMM,n:>,fb:-
setlocal commentstring=//\ %s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal cursorlineopt=both
setlocal define=
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=%+A\ %#%f\ %#(%l\\,%c):\ %m,%C%m
setlocal expandtab
if &filetype != 'typescript.tsx'
setlocal filetype=typescript.tsx
endif
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=10
setlocal foldmarker={{{,}}}
set foldmethod=indent
setlocal foldmethod=indent
setlocal foldminlines=1
set foldnestmax=10
setlocal foldnestmax=10
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=croql
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatprg=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=
setlocal includeexpr=
setlocal indentexpr=GetTsxIndent()
setlocal indentkeys=0{,0},0),0],0,,!^F,o,O,e,*<Return>,<>>,<<>,/
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255,$
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal lispwords=
setlocal nolist
setlocal makeencoding=
setlocal makeprg=tsc\ \ $*\ %
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=bin,octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal scrolloff=-1
setlocal shiftwidth=2
setlocal noshortname
setlocal showbreak=
setlocal sidescrolloff=-1
set signcolumn=number
setlocal signcolumn=number
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!airline#statusline(1)
setlocal suffixesadd=.ts,.tsx
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'typescript.tsx'
setlocal syntax=typescript.tsx
endif
setlocal tabstop=2
setlocal tagcase=
setlocal tagfunc=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal wincolor=
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
14
normal! zo
18
normal! zo
20
normal! zo
28
normal! zo
30
normal! zo
39
normal! zo
40
normal! zo
59
normal! zo
60
normal! zo
61
normal! zo
63
normal! zo
74
normal! zo
78
normal! zo
let s:l = 89 - ((37 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
89
normal! 059|
wincmd w
argglobal
if bufexists("frontend/src/styles/LandingSitePromo.scss") | buffer frontend/src/styles/LandingSitePromo.scss | else | edit frontend/src/styles/LandingSitePromo.scss | endif
setlocal keymap=
setlocal noarabic
setlocal noautoindent
setlocal backupcopy=
setlocal balloonexpr=
setlocal nobinary
setlocal nobreakindent
setlocal breakindentopt=
setlocal bufhidden=
setlocal buflisted
setlocal buftype=
setlocal nocindent
setlocal cinkeys=0{,0},0),0],:,0#,!^F,o,O,e
setlocal cinoptions=
setlocal cinwords=if,else,while,do,for,switch
setlocal colorcolumn=
setlocal comments=s1:/*,mb:*,ex:*/,://
setlocal commentstring=//\ %s
setlocal complete=.,w,b,u,t,i
setlocal concealcursor=
setlocal conceallevel=0
setlocal completefunc=
setlocal nocopyindent
setlocal cryptmethod=
setlocal nocursorbind
setlocal nocursorcolumn
set cursorline
setlocal cursorline
setlocal cursorlineopt=both
setlocal define=^\\s*\\%(@mixin\\|=\\)
setlocal dictionary=
setlocal nodiff
setlocal equalprg=
setlocal errorformat=
setlocal expandtab
if &filetype != 'scss'
setlocal filetype=scss
endif
setlocal fixendofline
setlocal foldcolumn=0
setlocal foldenable
setlocal foldexpr=0
setlocal foldignore=#
setlocal foldlevel=10
setlocal foldmarker={{{,}}}
set foldmethod=indent
setlocal foldmethod=indent
setlocal foldminlines=1
set foldnestmax=10
setlocal foldnestmax=10
setlocal foldtext=foldtext()
setlocal formatexpr=
setlocal formatoptions=tcq
setlocal formatlistpat=^\\s*\\d\\+[\\]:.)}\\t\ ]\\s*
setlocal formatprg=
setlocal grepprg=
setlocal iminsert=0
setlocal imsearch=-1
setlocal include=^\\s*@import\\s\\+\\%(url(\\)\\=[\"']\\=
setlocal includeexpr=substitute(v:fname,'\\%(.*/\\|^\\)\\zs','_','')
setlocal indentexpr=GetCSSIndent()
setlocal indentkeys=0{,0},!^F,o,O
setlocal noinfercase
setlocal iskeyword=@,48-57,_,192-255
setlocal keywordprg=
setlocal nolinebreak
setlocal nolisp
setlocal lispwords=
setlocal nolist
setlocal makeencoding=
setlocal makeprg=
setlocal matchpairs=(:),{:},[:]
setlocal modeline
setlocal modifiable
setlocal nrformats=bin,octal,hex
set number
setlocal number
setlocal numberwidth=4
setlocal omnifunc=csscomplete#CompleteCSS
setlocal path=
setlocal nopreserveindent
setlocal nopreviewwindow
setlocal quoteescape=\\
setlocal noreadonly
setlocal norelativenumber
setlocal norightleft
setlocal rightleftcmd=search
setlocal noscrollbind
setlocal scrolloff=-1
setlocal shiftwidth=2
setlocal noshortname
setlocal showbreak=
setlocal sidescrolloff=-1
set signcolumn=number
setlocal signcolumn=number
setlocal nosmartindent
setlocal softtabstop=2
setlocal nospell
setlocal spellcapcheck=[.?!]\\_[\\])'\"\	\ ]\\+
setlocal spellfile=
setlocal spelllang=en
setlocal statusline=%!airline#statusline(2)
setlocal suffixesadd=.sass,.scss,.css
setlocal swapfile
setlocal synmaxcol=3000
if &syntax != 'scss'
setlocal syntax=scss
endif
setlocal tabstop=2
setlocal tagcase=
setlocal tagfunc=
setlocal tags=
setlocal termwinkey=
setlocal termwinscroll=10000
setlocal termwinsize=
setlocal textwidth=0
setlocal thesaurus=
setlocal noundofile
setlocal undolevels=-123456
setlocal varsofttabstop=
setlocal vartabstop=
setlocal wincolor=
setlocal nowinfixheight
setlocal nowinfixwidth
setlocal wrap
setlocal wrapmargin=0
2
normal! zo
17
normal! zo
26
normal! zo
58
normal! zo
62
normal! zo
66
normal! zo
let s:l = 3 - ((2 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
3
normal! 034|
wincmd w
exe 'vert 1resize ' . ((&columns * 143 + 102) / 204)
exe 'vert 2resize ' . ((&columns * 60 + 102) / 204)
tabnext 1
badd +72 frontend/src/pages/LandingPage.tsx
badd +4 .gitignore
badd +39 frontend/src/styles/LandingSitePromo.scss
badd +11 frontend/src/api/user.ts
badd +30 frontend/src/components/LandingSitePromo.tsx
badd +57 api/views.py
badd +210 ~/.vim/vimrc
badd +1 landing/views.py
badd +1 api/factories.py
badd +1 frontend/admin.py
badd +70 frontend/i18n.ts
badd +1 frontend/jest.config.js
badd +1 frontend/models.py
badd +1 frontend/package.json
badd +1 frontend/postcss.config.js
badd +1 frontend/apps.py
badd +1 frontend/views.py
badd +1 frontend/src/core/interfaces/title.ts
badd +5 frontend/src/core/interfaces/topic.ts
badd +1 frontend/src/core/interfaces/season.ts
badd +34 frontend/src/context/auth-context.tsx
badd +16 frontend/src/App.tsx
badd +2 frontend/src/__tests__/Header.test.tsx
badd +1 frontend/src/constants/api.ts
badd +8 ~/.vim/coc-settings.json
badd +16 api/urls.py
badd +182 api/models.py
badd +57 frontend/src/pages/HomePage.tsx
badd +118 frontend/src/components/Header.tsx
badd +23 frontend/src/components/UnderlineLink.tsx
badd +14 frontend/src/components/Background.tsx
badd +23 frontend/src/pages/Router.tsx
badd +5 frontend/src/components/ScrollToTop.tsx
badd +1 frontend/static/frontend/fontawesome/svgs/solid/shield-alt.svg
badd +25 api/helpers.py
badd +208 api/serializers.py
badd +149 nights/settings.py
badd +45 frontend/src/pages/LoginPage.tsx
badd +10 frontend/src/pages/RegisterPage.tsx
badd +53 frontend/src/api/title.ts
badd +53 frontend/src/pages/CWPage.tsx
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOSc
set winminheight=1 winminwidth=1
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
