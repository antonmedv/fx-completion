#!/usr/bin/env bash

_fx_complete()
{
  local cur prev nb_colon
  _get_comp_words_by_ref -n : cur prev
  nb_colon=$(grep -o ":" <<< "$COMP_LINE" | wc -l)

  if [[ "$COMP_CWORD" -eq "1" ]]; then
    _filedir
  fi

  COMPREPLY+=( $(compgen -W '$(fx-completion "$((COMP_CWORD - (nb_colon * 2)))" "$prev" "${COMP_LINE}")' -- "$cur") )
}

if [[ -n "${BASH_VERSION}" ]]; then
  if ! [[ $(uname -s) =~ Darwin* ]]; then
    complete -o filenames -F _fx_complete fx
  else
    complete -F _fx_complete fx
  fi
else
  echo "Unsupported shell."
  exit 1
fi
